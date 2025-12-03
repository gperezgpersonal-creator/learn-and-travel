import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CartPage() {
    const t = useTranslations('Cart');

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="mb-8">{t('title')}</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Mock Item */}
                        <div className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                            <div className="w-24 h-24 bg-slate-200 rounded flex-shrink-0"></div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg mb-1">Silicon Valley Tech Tour</h3>
                                <p className="text-sm text-slate-500 mb-2">Jul 15 - Jul 25, 2026</p>
                                <div className="text-primary font-bold">$4,500 USD</div>
                            </div>
                            <button className="text-red-400 hover:text-red-600 self-start">✕</button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                        <h3 className="font-bold text-lg mb-4">{t('summary')}</h3>
                        <div className="flex justify-between mb-2 text-slate-600">
                            <span>{t('subtotal')}</span>
                            <span>$4,500 USD</span>
                        </div>
                        <div className="flex justify-between mb-4 text-slate-600">
                            <span>{t('fees')}</span>
                            <span>$0 USD</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                            <span>{t('total')}</span>
                            <span>$4,500 USD</span>
                        </div>
                        <Link href="/checkout" className="btn btn-primary w-full text-center block">
                            {t('checkout')}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
