
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any, // Suppressing type check for bleeding edge or mismatched types
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) {
            console.error('Missing signature or webhook secret');
            return new NextResponse('Webhook Error: Missing signature or secret', { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
        }
        return new NextResponse(`Webhook Error: Unknown error`, { status: 400 });
    }

    if (event.type === 'charge.succeeded') {
        const charge = event.data.object as Stripe.Charge;

        try {
            const { error } = await supabase
                .from('stripe_staging_area')
                .insert({
                    stripe_charge_id: charge.id,
                    amount: charge.amount / 100, // Convert cents to main currency unit
                    currency: charge.currency,
                    status: 'pending',
                    raw_data: charge as any, // Store raw JSON
                });

            if (error) {
                console.error('Error inserting into stripe_staging_area:', error);
                return new NextResponse('Database Error', { status: 500 });
            }
        } catch (dbError) {
            console.error('Database exception:', dbError);
            return new NextResponse('Database Exception', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
