import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client to bypass RLS for insertions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing. Sync will likely fail RLS.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST() {
    try {
        console.log('Starting Stripe Sync...');
        // Fetch last 100 charges
        const charges = await stripe.charges.list({
            limit: 100,
        });

        console.log(`Fetched ${charges.data.length} charges from Stripe.`);

        let addedCount = 0;
        let skippedCount = 0;

        for (const charge of charges.data) {
            // Check if exists
            const { data: existing } = await supabase
                .from('stripe_staging_area')
                .select('id')
                .eq('stripe_charge_id', charge.id)
                .single();

            if (!existing) {
                // Insert if not exists
                // We only insert succeeded charges usually, but let's take all and filter in UI if needed, 
                // OR just take succeeded. The user said "capture payments", so succeeded makes sense.
                if (charge.status === 'succeeded') {
                    // Enhance with PaymentIntent or Checkout Session metadata if Charge metadata is empty
                    let enhancedCharge = { ...charge };
                    let enhancedMetadata = { ...(charge.metadata || {}) };
                    let enhancedDescription = charge.description;

                    if (charge.payment_intent) {
                        try {
                            const piId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent.id;

                            // 1. Check PaymentIntent first
                            const pi = await stripe.paymentIntents.retrieve(piId);
                            if (pi.metadata && Object.keys(pi.metadata).length > 0) {
                                enhancedMetadata = { ...enhancedMetadata, ...pi.metadata };
                            }

                            // 2. If valid metadata still missing (e.g. no studentId), check Checkout Session
                            if (!enhancedMetadata.studentId || !enhancedMetadata.planDescription) {
                                const sessions = await stripe.checkout.sessions.list({
                                    payment_intent: piId,
                                    expand: ['data.line_items']
                                });

                                if (sessions.data.length > 0) {
                                    const session = sessions.data[0];
                                    if (session.metadata) {
                                        enhancedMetadata = { ...enhancedMetadata, ...session.metadata };
                                    }

                                    // Also get product name if description is generic
                                    if (session.line_items && session.line_items.data.length > 0) {
                                        const item = session.line_items.data[0];
                                        const productName = item.description;
                                        if (productName) {
                                            enhancedDescription = productName;
                                            // Also store it in metadata for easy access in UI
                                            enhancedMetadata.program = productName;
                                        }

                                        // Get Plan Description from Product (Fetch separately to avoid depth limit)
                                        if (item.price && item.price.product) {
                                            try {
                                                const productId = typeof item.price.product === 'string' ? item.price.product : item.price.product.id;
                                                const product = await stripe.products.retrieve(productId);
                                                if (product.description) {
                                                    enhancedMetadata.planDescription = product.description;
                                                }
                                            } catch (prodError) {
                                                console.error('Failed to fetch product details', prodError);
                                            }
                                        }
                                    }
                                }
                            }

                            enhancedCharge.metadata = enhancedMetadata;
                            enhancedCharge.description = enhancedDescription;
                            // Ensure raw_data reflects this
                            (enhancedCharge as any).metadata = enhancedMetadata;
                            (enhancedCharge as any).description = enhancedDescription;

                        } catch (fetchError) {
                            console.error('Failed to fetch related Stripe objects:', fetchError);
                        }
                    }

                    const { error } = await supabase
                        .from('stripe_staging_area')
                        .insert({
                            stripe_charge_id: charge.id,
                            amount: charge.amount / 100,
                            currency: charge.currency,
                            status: 'pending', // Default to pending so it can be assigned
                            created_at: new Date(charge.created * 1000).toISOString(),
                            raw_data: enhancedCharge as any,
                        });

                    if (error) {
                        console.error(`Error inserting charge ${charge.id}:`, error);
                    } else {
                        addedCount++;
                    }
                }
            } else {
                skippedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            added: addedCount,
            skipped: skippedCount,
            total_scanned: charges.data.length
        });

    } catch (err: any) {
        console.error('Sync Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
