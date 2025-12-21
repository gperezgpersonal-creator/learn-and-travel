import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-12-18.acacia' as any, // Supress type error for specific version, or use '2025-01-27.acacia' if valid
});

export async function POST(req: Request) {
    let lineItems: any[] = [];
    try {
        const { items, customerDetails } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // Map cart items to Stripe line items
        lineItems = items.map((item: CartItem) => {
            // Ensure price is a number
            const unitAmount = Math.round(Number(item.price) * 100); // Stripe expects cents

            // Ensure absolute URL for images (Stripe requirement)
            let imageUrl = item.image;
            if (imageUrl && imageUrl.startsWith('/')) {
                imageUrl = `${process.env.NEXT_PUBLIC_URL}${imageUrl}`;
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        description: `Plan: ${item.plan || 'Standard'}`,
                        images: imageUrl ? [imageUrl] : [],
                    },
                    unit_amount: unitAmount,
                },
                quantity: 1,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart?canceled=true`,
            customer_email: customerDetails?.studentEmail, // Pre-fill email in Stripe
            metadata: {
                studentName: customerDetails?.studentName,
                studentId: customerDetails?.studentId,
                school: customerDetails?.school,
                address: customerDetails?.address,
                phone: customerDetails?.phone,
                // Add any other fields you want to see in the dashboard
            },
        });

        // Store order in Supabase
        const { error: dbError } = await supabase.from('orders').insert({
            stripe_session_id: session.id,
            customer_email: customerDetails?.studentEmail,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            status: 'pending',
            metadata: {
                studentName: customerDetails?.studentName,
                studentId: customerDetails?.studentId,
                school: customerDetails?.school
            }
        });

        if (dbError) {
            console.error('Supabase Error:', dbError);
            // We don't block the checkout flow if DB fails, but we log it.
        }

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: unknown) {
        console.error('Stripe Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
