import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-12-18.acacia' as any,
});

export async function GET() {
    try {
        const sessions = await stripe.checkout.sessions.list({
            limit: 20,
            expand: ['data.line_items'],
        });

        // Map relevant data for the dashboard
        const orders = sessions.data.map(session => {
            const lineItem = session.line_items?.data[0]; // Assuming one main program per order
            return {
                id: session.id,
                date: new Date(session.created * 1000).toLocaleDateString('es-MX'),
                amount: session.amount_total ? session.amount_total / 100 : 0,
                status: session.payment_status,
                customerEmail: session.customer_details?.email || session.customer_email || 'N/A',
                customerName: session.metadata?.studentName || session.customer_details?.name || 'N/A',
                metadata: session.metadata || {},
                programName: lineItem?.description || 'Desconocido',
            };
        });

        return NextResponse.json({ orders });
    } catch (err: unknown) {
        console.error('Stripe Admin Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
