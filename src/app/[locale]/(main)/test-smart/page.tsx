'use client';

import SmartPriceCard from '@/components/smart/SmartPriceCard';
import SmartItinerary from '@/components/smart/SmartItinerary';
import SmartInclusions from '@/components/smart/SmartInclusions';

export default function TestSmartComponentsPage() {
    // This simulates what the design team would do:
    // "Just paste the components and put the ID"
    const PROGRAM_ID = '84-ORL2026'; // We know this exists (or user creates it)

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Prueba de "Smart Components"</h1>
                    <p className="text-slate-600">
                        Esta página simula un diseño personalizado donde integramos datos del CMS usando solo el ID:
                        <span className="font-mono bg-yellow-100 px-2 py-1 rounded ml-2 font-bold">{PROGRAM_ID}</span>
                    </p>
                </div>

                {/* Simulation: Hero Section Custom Design */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-bold mb-6 text-purple-600">1. Componente de Precios (SmartPriceCard)</h2>
                    <p className="mb-4 text-sm text-slate-500">Este bloque carga los precios y planes dinámicamente:</p>

                    <div className="max-w-md mx-auto">
                        <SmartPriceCard programId={PROGRAM_ID} />
                    </div>
                </div>

                {/* Simulation: Itinerary Section */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-bold mb-6 text-blue-600">2. Itinerario (SmartItinerary)</h2>
                    <SmartItinerary programId={PROGRAM_ID} />
                </div>

                {/* Simulation: Inclusions Section */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-bold mb-6 text-green-600">3. Inclusiones (SmartInclusions)</h2>
                    <SmartInclusions programId={PROGRAM_ID} className="bg-slate-50 p-6 rounded-lg" />
                </div>

            </div>
        </div>
    );
}
