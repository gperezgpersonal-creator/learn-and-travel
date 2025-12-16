'use client';

import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/navigation';
import { X, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { formatCurrency } from '@/utils/format';

// Initialize Stripe (Replace with your public key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample');

export default function CartDrawer() {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, total } = useCart();
    // const t = useTranslations('Cart'); // Assuming translation keys, using fallback for now

    if (!isCartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={toggleCart}
            />

            {/* Sidebar */}
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Tu Reserva</h2>
                    <button onClick={toggleCart} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p className="text-lg mb-4">Tu carrito está vacío</p>
                            <button onClick={toggleCart} className="text-primary font-bold hover:underline">
                                Explorar Programas
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 line-clamp-2">{item.title}</h3>
                                    {item.plan && (
                                        <div className="text-xs text-white bg-accent px-2 py-1 rounded-full inline-block font-bold mb-2">
                                            {item.plan}
                                        </div>
                                    )}
                                    <p className="text-slate-500 text-sm mt-1 mb-2">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-500 font-medium">Total Estimado</span>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={toggleCart}
                            className="w-full btn btn-primary py-4 text-lg shadow-lg flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Proceder al Pago
                        </Link>
                        <Link
                            href="/cart"
                            onClick={toggleCart}
                            className="w-full btn btn-outline py-3 mt-3 text-sm flex items-center justify-center hover:bg-slate-100 border-slate-200 text-slate-600"
                        >
                            Ver Carrito Completo
                        </Link>
                        <p className="text-xs text-center text-slate-400 mt-4">
                            Pagos procesados de forma segura por Stripe.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
