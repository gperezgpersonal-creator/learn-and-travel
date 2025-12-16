'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Trash2, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams, useRouter } from 'next/navigation';

// Initialize Stripe outside of component to avoid recreating stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CartPage() {
    const t = useTranslations('Cart');
    const { cartItems, removeFromCart, total, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Handle success return from Stripe
    useEffect(() => {
        if (searchParams.get('success')) {
            clearCart();
            // Optional: Show success message toast or modal
        }
    }, [searchParams, clearCart]);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cartItems }),
            });

            const { url, error } = await response.json();

            if (error) {
                console.error('Checkout error:', error);
                alert('Error al iniciar pago: ' + error);
                return;
            }

            if (url) {
                window.location.href = url;
            } else {
                alert('No se pudo iniciar el checkout.');
            }
        } catch (err) {
            console.error('Checkout exception:', err);
            alert('Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    // If success param is present, show Thank You message instead of cart
    if (searchParams.get('success')) {
        return (
            <main className="bg-slate-50 min-h-screen py-20 flex items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ✅
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">¡Gracias por tu compra!</h1>
                    <p className="text-slate-500 mb-8">Tu reservación ha sido confirmada. En breve recibirás un correo con los detalles.</p>
                    <Link href="/tec-de-monterrey" className="btn btn-primary block w-full">
                        Volver a Programas
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-slate-800">{t('title')}</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            🛒
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
                        <p className="text-slate-500 mb-8">Parece que aún no has agregado ningún programa.</p>
                        <Link href="/tec-de-monterrey" className="btn btn-primary inline-flex">
                            Explorar Programas
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="md:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm flex gap-6 items-start">
                                    <div className="relative w-24 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg mb-1 text-slate-800">{item.title}</h3>
                                        {item.plan && (
                                            <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-bold mb-2 uppercase tracking-wide">
                                                {item.plan}
                                            </span>
                                        )}
                                        <p className="text-sm text-slate-500 mb-4">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-primary font-bold text-xl">
                                                {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                        aria-label="Eliminar"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
                            <h3 className="font-bold text-lg mb-6 pb-4 border-b border-slate-100">{t('summary')}</h3>
                            <div className="flex justify-between mb-3 text-slate-600">
                                <span>{t('subtotal')}</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between mb-6 text-slate-600">
                                <span>{t('fees')}</span>
                                <span>{formatCurrency(0)}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-xl mb-8 text-slate-800">
                                <span>{t('total')}</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <Link
                                href="/checkout"
                                className="btn btn-primary w-full text-center block py-4 shadow-lg mb-4 flex items-center justify-center gap-2"
                            >
                                {t('checkout')}
                            </Link>
                            <Link href="/tec-de-monterrey" className="text-center block text-sm text-slate-500 hover:text-primary transition-colors">
                                Continuar Comprando
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
