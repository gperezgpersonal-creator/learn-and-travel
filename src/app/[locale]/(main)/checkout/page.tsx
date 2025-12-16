'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Link } from '@/navigation';

export default function CheckoutPage() {
    const t = useTranslations('Cart'); // Reuse cart translations where applicable or add new ones
    const { cartItems, total } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        studentEmail: '',
        school: '',
        address: '',
        phone: ''
    });

    if (cartItems.length === 0) {
        return (
            <main className="bg-slate-50 min-h-screen py-12">
                <div className="container-custom max-w-4xl text-center">
                    <h1 className="text-3xl font-bold mb-4 text-slate-800">Tu carrito está vacío</h1>
                    <Link href="/tec-de-monterrey" className="btn btn-primary inline-flex">
                        Explorar Programas
                    </Link>
                </div>
            </main>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems,
                    customerDetails: formData
                }),
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

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom max-w-5xl">
                <h1 className="text-3xl font-bold mb-8 text-slate-800">Finalizar Reserva</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Form Column */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Datos del Estudiante
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="studentName" className="text-sm font-medium text-slate-700">
                                            Nombre Completo del Alumno *
                                        </label>
                                        <input
                                            type="text"
                                            id="studentName"
                                            name="studentName"
                                            required
                                            value={formData.studentName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="studentId" className="text-sm font-medium text-slate-700">
                                            Matrícula / ID Educativo *
                                        </label>
                                        <input
                                            type="text"
                                            id="studentId"
                                            name="studentId"
                                            required
                                            value={formData.studentId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            placeholder="Ej. A01234567"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="studentEmail" className="text-sm font-medium text-slate-700">
                                            Correo Educativo *
                                        </label>
                                        <input
                                            type="email"
                                            id="studentEmail"
                                            name="studentEmail"
                                            required
                                            value={formData.studentEmail}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            placeholder="juan@tec.mx"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                            Teléfono de Contacto *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            placeholder="+52 55 1234 5678"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="school" className="text-sm font-medium text-slate-700">
                                        Escuela y Campus (si aplica)
                                    </label>
                                    <input
                                        type="text"
                                        id="school"
                                        name="school"
                                        value={formData.school}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="Ej. Tec de Monterrey, Campus Santa Fe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="address" className="text-sm font-medium text-slate-700">
                                        Dirección Completa *
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        required
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Calle, número, colonia, ciudad, código postal."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full btn btn-primary py-4 text-lg font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creando sesión de pago...
                                            </>
                                        ) : (
                                            'Continuar al Pago Seguro'
                                        )}
                                    </button>
                                    <p className="text-xs text-center text-slate-500 mt-4">
                                        Paso 2 de 2: Pagos procesados de forma segura por Stripe.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Summary Column */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-slate-800">Resumen del Pedido</h2>
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 text-sm">
                                        <div className="w-16 h-16 bg-slate-100 rounded-md relative overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 line-clamp-2">{item.title}</p>
                                            <p className="text-slate-500">{item.plan}</p>
                                            <p className="text-primary font-bold">{formatCurrency(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-xl text-slate-800">
                                <span>Total a Pagar</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
