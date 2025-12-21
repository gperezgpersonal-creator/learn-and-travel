import { redirect } from 'next/navigation';
import { Stripe } from 'stripe';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';
import { CheckCircle, ArrowRight, BookOpen, Map, FileText, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PrintButton from '@/components/ui/PrintButton';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-12-18.acacia' as any,
});

async function getOrderDetails(sessionId: string) {
    try {
        const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('stripe_session_id', sessionId)
            .single();

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items']
        });

        return { order, session };
    } catch (error) {
        console.error('Error fetching order:', error);
        return { order: null, session: null };
    }
}

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string }>;
}) {
    const { session_id } = await searchParams;

    if (!session_id) {
        redirect('/');
    }

    // Fetch order details
    const { order, session } = await getOrderDetails(session_id);

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center text-slate-900">
                    <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                    <p className="text-slate-500 mb-4">We couldn&apos;t find the order details.</p>
                    <Link href="/" className="btn btn-primary">Return Home</Link>
                </div>
            </div>
        );
    }

    const customerName = session.customer_details?.name || 'Viajero';
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    // Type casting for payment method details (Stripe types can be tricky with expansion)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentIntent = session.payment_intent as any;
    const paymentMethod = paymentIntent?.payment_method_options?.card || paymentIntent?.payment_method?.card;
    const cardBrand = paymentMethod?.brand || 'Card';
    const cardLast4 = paymentMethod?.last4 || '****';

    const orderId = order?.id || 'PENDING';
    const dateObj = new Date();
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);

    // Format: DD-MM-YY-ID (e.g. 17-12-25-1100)
    const displayOrderNumber = order?.id
        ? `${day}-${month}-${year}-${order.id}`
        : session.payment_intent as string || session.id.slice(-8);

    const resources = [
        {
            title: "Prepare for your Trip",
            description: "Essential packing list.",
            icon: Map,
            href: "/blog"
        },
        {
            title: "Visa & Requirements",
            description: "Entry documentation.",
            icon: FileText,
            href: "/blog"
        },
        {
            title: "Cultural Guide",
            description: "Local customs.",
            icon: BookOpen,
            href: "/blog"
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 py-8 md:py-16 px-4 print:bg-white print:p-0">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 2cm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />
            <div className="container-custom max-w-4xl print:max-w-none print:w-full">

                <FadeIn>
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8 md:mb-12 print:shadow-none print:border-none print:mb-0">

                        {/* Corporate Header */}
                        <div className="bg-slate-900 text-white p-6 md:p-10 text-center relative overflow-hidden print:bg-slate-900 print:text-white">
                            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-10 pointer-events-none transform -skew-y-12 scale-150 print:hidden"></div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-white/20 print:border-white/50">
                                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                                <h1 className="text-xl md:text-3xl font-serif font-bold mb-2 text-white">¡Gracias por tu compra!</h1>
                                <p className="text-slate-300 text-xs md:text-sm uppercase tracking-widest font-medium print:text-slate-200">Comprobante de Pago</p>
                            </div>
                        </div>

                        {/* Receipt Body */}
                        <div className="p-6 md:p-12 print:p-8">

                            {/* Merchant & Order Info Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-8 mb-8 gap-8 print:border-slate-200 print:flex-row">
                                <div className="order-2 md:order-1">
                                    <h2 className="font-bold text-slate-900 text-lg mb-1">Learn and Travel</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        contacto@ariagui.com<br />
                                        Av. Eugenio Garza Sada 2501 Sur<br />
                                        Tecnológico, 64849 Monterrey, N.L.
                                    </p>
                                </div>
                                <div className="order-1 md:order-2 text-left md:text-right print:text-right">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Número de Orden</p>
                                    <p className="text-xl md:text-2xl font-mono font-bold text-slate-900 mb-2">{displayOrderNumber}</p>
                                    <p className="text-sm text-slate-600">Fecha: {dateObj.toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Bill To & Payment Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100 print:border-slate-200 print:grid-cols-2">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3">Facturar a</p>
                                    <p className="font-bold text-slate-900">{customerName}</p>
                                    <p className="text-slate-600 text-sm">{session.customer_details?.email}</p>
                                    {session.customer_details?.address && (
                                        <p className="text-slate-600 text-sm mt-1">
                                            {session.customer_details.address.line1}<br />
                                            {session.customer_details.address.city}, {session.customer_details.address.country}
                                        </p>
                                    )}
                                </div>
                                <div className="md:text-left print:text-left">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3">Método de Pago</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-medium text-slate-900 capitalize">{cardBrand} •••• {cardLast4}</p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100 print:border-green-600 print:text-green-800">
                                        PAGADO
                                    </div>
                                </div>
                            </div>

                            {/* Line Items Table (Receipt Style) */}
                            <div className="mb-8 overflow-x-auto">
                                <table className="w-full text-left text-sm min-w-[500px] md:min-w-0">
                                    <thead className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider text-xs print:border-black">
                                        <tr>
                                            <th className="py-3 pr-4">Descripción</th>
                                            <th className="py-3 px-4 text-center">Cant.</th>
                                            <th className="py-3 pl-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                                        {session.line_items?.data.map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-4 pr-4">
                                                    <span className="font-bold text-slate-900 block text-sm md:text-base">{item.description}</span>
                                                </td>
                                                <td className="py-4 px-4 text-center text-slate-600">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-4 pl-4 text-right font-bold text-slate-900">
                                                    ${(item.amount_total / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t-2 border-slate-900 print:border-black">
                                        <tr>
                                            <td colSpan={2} className="pt-4 text-right font-medium text-slate-600">Subtotal</td>
                                            <td className="pt-4 text-right font-medium text-slate-900">${amountTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} className="pt-2 text-right font-bold text-slate-900 text-lg">Total Pagado</td>
                                            <td className="pt-2 text-right font-bold text-slate-900 text-lg">${amountTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Print Footer */}
                            <div className="hidden print:block mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                                <p>Gracias por viajar con nosotros. Visita www.learnandtravel.com</p>
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center print:hidden">
                        <Link href="/" className="btn btn-outline flex-1 md:flex-none justify-center">
                            Volver al Inicio
                        </Link>
                        <div className="flex-1 md:flex-none text-slate-900">
                            <PrintButton />
                        </div>
                    </div>
                </FadeIn>

                {/* Resources Section */}
                <FadeIn delay={0.2}>
                    <div className="print:hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-xl font-serif font-bold text-slate-900">Prepárate para tu aventura</h2>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {resources.map((resource, i) => (
                                <Link
                                    key={i}
                                    href={resource.href}
                                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-900 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-slate-50 rounded-md text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <resource.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm">{resource.title}</h3>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{resource.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </FadeIn>

            </div>
        </main>
    );
}
