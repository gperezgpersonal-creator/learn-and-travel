'use client';

import LivePricing from '@/components/programs/LivePricing';
import Image from 'next/image';

// Simulation: 
// The team designs this page "Program_84_ORL2026.tsx"
// They don't touch the price logic, they just drop the widget.

export default function Program_84_ORL2026() {
    return (
        <div className="font-sans bg-white min-h-screen">
            {/* Header / Hero Section (Design) */}
            <div className="relative h-[60vh] w-full bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90" />
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    <span className="text-[#FFD700] text-lg font-bold tracking-[0.2em] mb-4 uppercase">Nuevo Diseño 2026</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6">
                        Orlando Experience
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Este es un ejemplo de una página completamente nueva, con su propio diseño,
                        pero conectada al mismo "cerebro" de precios.
                    </p>
                </div>
            </div>

            {/* Custom Content Section */}
            <div className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Experiencia Personalizada</h2>
                        <p className="text-lg text-slate-600 mb-4">
                            Imagina que tu equipo de diseño crea una estructura totalmente diferente para una campaña de Marketing específica (ej. Black Friday o Alumnos de Excelencia).
                        </p>
                        <ul className="space-y-3 text-slate-600">
                            <li className="flex items-center gap-2">✅ Diseño único y libre</li>
                            <li className="flex items-center gap-2">✅ Sin código complejo</li>
                            <li className="flex items-center gap-2">✅ Precios siempre actualizados</li>
                        </ul>
                    </div>

                    {/* THE WIDGET */}
                    <div className="bg-[#122045] p-8 rounded-3xl border border-indigo-900 shadow-xl shadow-indigo-900/20">
                        <div className="text-center mb-6">
                            <p className="text-xs font-bold text-[#FFD700] uppercase tracking-widest">Conector Automático</p>
                            <h3 className="text-2xl font-bold text-white">Inscripción Inmediata</h3>
                        </div>

                        {/* HERE IS THE MAGIC: Using ID + Dark Variant */}
                        <LivePricing
                            id="84-ORL2026"
                            customTitle="Tu lugar en Orlando"
                            showTitle={false}
                            variant="dark"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
