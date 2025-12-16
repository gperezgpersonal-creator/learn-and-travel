'use client';

import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';
import { useState } from 'react';

export default function ContactPage() {
    const t = useTranslations('Contact');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interest: 'Programas Educativos', // Default to avoid empty value issues
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.error) {
                setStatus({ type: 'error', message: data.error });
            } else {
                setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.' });
                setFormData({ name: '', email: '', interest: 'Programas Educativos', message: '' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Error al enviar el mensaje. Inténtalo de nuevo.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom">
                <FadeIn direction="up">
                    <h1 className="text-center mb-4 text-4xl font-serif font-bold text-slate-900">{t('title')}</h1>
                    <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">{t('subtitle')}</p>
                </FadeIn>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <FadeIn direction="up" delay={0.1}>
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('name')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('interest')}</label>
                                        <select
                                            value={formData.interest}
                                            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="Programas Educativos">{t('interestPrograms')}</option>
                                            <option value="Alianzas">{t('interestPartnership')}</option>
                                            <option value="Información General">{t('interestGeneral')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('message')}</label>
                                        <textarea
                                            rows={5}
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        ></textarea>
                                    </div>

                                    {status.message && (
                                        <div className={`p-4 rounded text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {status.message}
                                        </div>
                                    )}

                                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2">
                                        {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
                                        {isLoading ? 'Enviando...' : t('submit')}
                                    </button>
                                </form>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        <FadeIn direction="up" delay={0.2}>
                            <div className="bg-primary text-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl mb-6 font-bold">{t('contactInfo')}</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-white text-xs font-bold uppercase mb-1">{t('emailLabel')}</div>
                                        <p className="text-lg">contacto@ariagui.com</p>
                                    </div>
                                    <div>
                                        <div className="text-white text-xs font-bold uppercase mb-1">{t('addressLabel')}</div>
                                        <div className="space-y-4">
                                            <p className="leading-relaxed">{t('miamiAddress')}</p>
                                            <p className="leading-relaxed">{t('mexicoAddress')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </main>
    );
}
