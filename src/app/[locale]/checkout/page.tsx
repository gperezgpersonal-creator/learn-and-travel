import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
    const t = useTranslations('Checkout');

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="mb-8">{t('title')}</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h2 className="text-xl mb-6">{t('studentDetails')}</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('firstName')}</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('lastName')}</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
                                    <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h2 className="text-xl mb-6">{t('payment')}</h2>
                            <div className="p-4 border border-slate-200 rounded bg-slate-50 text-center text-slate-500">
                                Stripe Payment Element Placeholder
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
                        <h3 className="font-bold text-lg mb-4">{t('orderSummary')}</h3>
                        <div className="mb-4 pb-4 border-b border-slate-100">
                            <div className="font-medium">Silicon Valley Tech Tour</div>
                            <div className="text-sm text-slate-500">Jul 15 - Jul 25, 2026</div>
                            <div className="text-sm font-bold mt-1">$4,500 USD</div>
                        </div>

                        <div className="flex justify-between font-bold text-lg mb-6">
                            <span>{t('total')}</span>
                            <span>$4,500 USD</span>
                        </div>

                        <label className="flex gap-2 items-start text-sm text-slate-600 mb-6">
                            <input type="checkbox" className="mt-1" />
                            <span>{t('agreeTerms')}</span>
                        </label>

                        <button className="btn btn-primary w-full">
                            {t('payNow')}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
