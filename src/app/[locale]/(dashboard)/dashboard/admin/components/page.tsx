'use client';

import React, { useState } from 'react';
import SmartPriceCard from '@/components/smart/SmartPriceCard';
import SmartItinerary from '@/components/smart/SmartItinerary';
import SmartInclusions from '@/components/smart/SmartInclusions';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ComponentsCatalogPage() {
    // We use a known ID for the preview. In production, this could be dynamic or a fixed demo ID.
    const DEMO_ID = '84-ORL2026';

    const components = [
        {
            name: 'Tarjeta de Precios (Price Card)',
            description: 'Muestra el precio, planes de pago y botón de reservación. Se adapta a si está agotado o vencido.',
            component: <SmartPriceCard programId={DEMO_ID} />,
            code: `<SmartPriceCard programId="ID_DEL_PROGRAMA" />`
        },
        {
            name: 'Itinerario (Itinerary)',
            description: 'Despliega la lista de actividades día por día.',
            component: <SmartItinerary programId={DEMO_ID} />,
            code: `<SmartItinerary programId="ID_DEL_PROGRAMA" />`
        },
        {
            name: 'Inclusiones (Inclusions)',
            description: 'Lista de lo que incluye el viaje con iconos de verificación.',
            component: <SmartInclusions programId={DEMO_ID} />,
            code: `<SmartInclusions programId="ID_DEL_PROGRAMA" />`
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/admin/cms" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Catálogo de Componentes</h1>
                    <p className="text-gray-500">Guía de referencia para el equipo de diseño.</p>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-sm text-yellow-800">
                <strong>Nota para Diseñadores:</strong> Para usar estos componentes, copien el código y reemplacen
                <span className="font-mono font-bold mx-1">ID_DEL_PROGRAMA</span> por el ID Interno del viaje (ej. <span className="font-mono">84-ORL2026</span>).
            </div>

            <div className="grid gap-12">
                {components.map((item, index) => (
                    <ComponentShowcase key={index} item={item} />
                ))}
            </div>
        </div>
    );
}

function ComponentShowcase({ item }: { item: any }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(item.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700"
                >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? '¡Copiado!' : 'Copiar Código'}
                </button>
            </div>

            <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                {/* Visual Preview */}
                <div className="p-8 bg-slate-50 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider text-center">Vista Previa</div>
                        {item.component}
                    </div>
                </div>

                {/* Code Snippet */}
                <div className="p-6 bg-slate-900 overflow-x-auto flex items-center">
                    <pre className="text-blue-300 font-mono text-sm leading-relaxed">
                        <code>{item.code}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
