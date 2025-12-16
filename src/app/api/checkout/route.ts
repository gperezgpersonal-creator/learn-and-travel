import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any, // Supress type error for specific version, or use '2025-01-27.acacia' if valid
});

export async function POST(req: Request) {
    try {
        const { items, customerDetails } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // Map cart items to Stripe line items
        const lineItems = items.map((item: any) => {
            // Ensure price is a number
            const unitAmount = Math.round(Number(item.price) * 100); // Stripe expects cents

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        description: `Plan: ${item.plan || 'Standard'}`,
                        images: item.image ? [item.image] : [],
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
            success_url: `${process.env.NEXT_PUBLIC_URL}/cart?success=true&session_id={CHECKOUT_SESSION_ID}`,
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

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
