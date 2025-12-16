
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendEmail } from '@/lib/email';
import { formatCurrency } from '@/utils/format';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
    try {
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
        }

        // 1. Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'customer'],
        });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }

        // 2. Extract Data
        const customerEmail = session.customer_details?.email || session.customer_email || 'No email provided';
        const customerName = session.customer_details?.name || 'Cliente';
        const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
        const lineItems = session.line_items?.data || [];

        // Metadata fields
        const studentName = session.metadata?.studentName || 'N/A';
        const studentId = session.metadata?.studentId || 'N/A';
        const school = session.metadata?.school || 'N/A';

        // 3. Construct Email Content
        const itemsListHtml = lineItems.map(item =>
            `<li>${item.description} (x${item.quantity}) - ${formatCurrency(item.amount_total / 100)}</li>`
        ).join('');

        const adminEmailHtml = `
            <h2>Nueva Venta Confirmada 🎉</h2>
            <p>Se ha recibido un nuevo pago a través de Stripe.</p>
            
            <h3>Detalles del Cliente</h3>
            <ul>
                <li><strong>Nombre:</strong> ${customerName}</li>
                <li><strong>Email:</strong> ${customerEmail}</li>
                <li><strong>Alumno:</strong> ${studentName} (ID: ${studentId})</li>
                <li><strong>Escuela:</strong> ${school}</li>
            </ul>

            <h3>Detalles de la Orden</h3>
            <ul>
                ${itemsListHtml}
            </ul>
            <p><strong>Total: ${formatCurrency(amountTotal)}</strong></p>
            <p><a href="https://dashboard.stripe.com/payments/${session.payment_intent}">Ver en Stripe Dashboard</a></p>
        `;

        const customerEmailHtml = `
            <h2>¡Gracias por tu compra!</h2>
            <p>Hola ${customerName},</p>
            <p>Hemos confirmado tu pago correctamente. A continuación los detalles de tu orden:</p>
            
            <h3>Resumen</h3>
            <ul>
                ${itemsListHtml}
            </ul>
            <p><strong>Total Pagado: ${formatCurrency(amountTotal)}</strong></p>
            
            <p>Pronto nos pondremos en contacto contigo con más información sobre el programa.</p>
            <p>Si tienes dudas, responde a este correo.</p>
        `;

        // 4. Send Emails in Parallel
        const adminMailPromise = sendEmail({
            to: process.env.EMAIL_USER!,
            subject: `💰 Nueva Venta: ${formatCurrency(amountTotal)} - ${studentName}`,
            html: adminEmailHtml,
        });

        const customerMailPromise = sendEmail({
            to: customerEmail,
            subject: 'Confirmación de pago - Learn and Travel',
            html: customerEmailHtml,
        });

        await Promise.all([adminMailPromise, customerMailPromise]);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Payment Success Handler Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
