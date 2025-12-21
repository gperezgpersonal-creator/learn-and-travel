'use client';

import PricingManager from '@/components/admin/finance/pricing/PricingManager';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import FadeIn from '@/components/ui/FadeIn';
import { Download } from 'lucide-react';
import { Link } from '@/navigation';
import QuoteGenerator from '@/components/admin/finance/QuoteGenerator';
import QuoteHistory from '@/components/admin/finance/QuoteHistory';
import OrdersTable from '@/components/admin/finance/OrdersTable';

export default function FinancePage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') as 'quoter' | 'historial' | 'orders' | 'pricing' | null;
    const [activeTab, setActiveTab] = useState<'quoter' | 'historial' | 'orders' | 'pricing'>(initialTab || 'quoter');
    const [loadedVersion, setLoadedVersion] = useState<any>(null);

    const handleLoadVersion = (version: any) => {
        setLoadedVersion(version.data);
        setActiveTab('quoter');
    };

    return (
        <div className="space-y-8 relative">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Financial Management</h1>
                        <p className="text-slate-500">Administración de cotizaciones y pedidos.</p>
                    </div>
                </div>
            </FadeIn>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
                {['quoter', 'historial', 'orders', 'pricing'].map((tab) => (
                    <button
                        key={tab}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 capitalize whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab === 'quoter' ? 'Nuevo Cotizador' :
                            tab === 'historial' ? 'Historial Cotizaciones' :
                                tab === 'orders' ? 'Admin Orders' :
                                    tab === 'pricing' ? 'Precios' : tab}
                    </button>
                ))}
            </div>

            {/* QUOTER VIEW */}
            {activeTab === 'quoter' && (
                <FadeIn>
                    <QuoteGenerator initialData={loadedVersion} onClearInitialData={() => setLoadedVersion(null)} />
                </FadeIn>
            )}

            {/* HISTORY VIEW */}
            {activeTab === 'historial' && (
                <FadeIn>
                    <QuoteHistory onLoadVersion={handleLoadVersion} />
                </FadeIn>
            )}

            {/* PRICING VIEW */}
            {activeTab === 'pricing' && (
                <FadeIn>
                    <PricingManager />
                </FadeIn>
            )}

            {/* ORDERS VIEW */}
            {activeTab === 'orders' && (
                <FadeIn>
                    <OrdersTable />
                </FadeIn>
            )}
        </div>
    );
}


