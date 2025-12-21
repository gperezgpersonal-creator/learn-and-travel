'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/data/programs';
import { MOCK_PROGRAMS } from '@/services/mock/mockData';
import PaymentPlanSelector from '@/components/cart/PaymentPlanSelector';
import { Loader2 } from 'lucide-react';
import { ProgramService } from '@/services/supabase/programService';

interface LivePricingProps {
    id?: string;
    slug?: string;
    showTitle?: boolean;
    customTitle?: string;
    variant?: 'default' | 'minimal' | 'dark';
}

export default function LivePricing({
    id,
    slug,
    showTitle = true,
    customTitle,
    variant = 'default'
}: LivePricingProps) {
    const [program, setProgram] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgram = () => {
            setIsLoading(true);
            const targetId = id;
            const targetSlug = slug;

            if (!targetId && !targetSlug) {
                setError('ID o Slug no especificado');
                setIsLoading(false);
                return;
            }

            const loadData = async () => {
                try {
                    // 1. Try fetching from Supabase via Service


                    let fetchedProgram: Program | null = null;
                    if (targetId) {
                        fetchedProgram = await ProgramService.getById(targetId);
                    } else if (targetSlug) {
                        fetchedProgram = await ProgramService.getBySlug(targetSlug);
                    }

                    if (fetchedProgram) {
                        console.log("LivePricing: Data loaded from Supabase");
                        setProgram(fetchedProgram);
                        setIsLoading(false);
                        return; // Found in DB, we are done.
                    }

                    // 2. Fallback to Static/Mock Data
                    // If DB is empty or connection fails, we show Mock data so the site doesn't break
                    // for the static programs like 'Orlando' until they are fully migrated.
                    const mockMatch = MOCK_PROGRAMS.find(p =>
                        (targetId && p.id === targetId) ||
                        (targetSlug && p.slug === targetSlug)
                    );

                    if (mockMatch) {
                        console.log("LivePricing: Using Mock/Static fallback (DB Row Not Found)");
                        setProgram(mockMatch as unknown as Program);
                    } else {
                        setError('Programa no encontrado (DB/Mock)');
                    }

                } catch (err) {
                    console.error("LivePricing Unexpected Error:", err);
                    setError('Error cargando precios');
                } finally {
                    setIsLoading(false);
                }
            };

            loadData();
        };

        fetchProgram();
    }, [id, slug]);

    if (isLoading) {
        return (
            <div className={`flex flex-col items-center justify-center p-12 rounded-xl border min-h-[300px] ${variant === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'
                }`}>
                <Loader2 className={`w-8 h-8 animate-spin mb-4 ${variant === 'dark' ? 'text-white' : 'text-[#122045]'}`} />
                <p className={`text-sm font-medium ${variant === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                    Cargando precios actualizados...
                </p>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="p-8 bg-red-50 rounded-xl text-center border border-red-100">
                <p className="text-red-600 font-medium">{error || 'Información no disponible'}</p>
            </div>
        );
    }

    // Dynamic classes based on variant
    const containerClasses = {
        default: 'bg-white rounded-2xl shadow-xl border border-slate-100',
        minimal: 'bg-transparent',
        dark: 'bg-slate-800 rounded-2xl shadow-xl border border-slate-700 text-white'
    };

    return (
        <div className="w-full">
            {showTitle && (
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-widest text-[#FFD700] font-bold mb-2">Inversión Total</p>
                    <div className="text-6xl font-bold font-serif text-white mb-4">
                        ${program.price.toLocaleString()} <span className="text-2xl font-sans font-normal text-slate-400">{program.currency || 'USD'}</span>
                    </div>
                </div>
            )}

            <div className={`p-6 md:p-8 ${containerClasses[variant]}`}>
                {customTitle && (
                    <h3 className={`text-2xl font-bold mb-6 text-center ${variant === 'dark' ? 'text-white' : 'text-[#122045]'}`}>
                        {customTitle}
                    </h3>
                )}

                {/* Note: PaymentPlanSelector might need adjustments for dark mode too, but for now we wrap it */}
                <div className={variant === 'dark' ? 'dark-mode-wrapper' : ''}>
                    <PaymentPlanSelector
                        title={customTitle || program.title}
                        image={program.image || '/images/placeholder.jpg'}
                        description={program.description || ''}
                        plans={program.plans || []}
                        highlightDeposit={id === '84-ORL2026' || program.id === '84-ORL2026'}
                    />
                </div>

                <p className={`text-center text-[10px] mt-4 ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Datos actualizados en tiempo real. | Source: {program.id && !('mock' in program) ? 'DB Live' : 'Static Fallback'} | ID: {id || slug}
                </p>
            </div>
        </div>
    );
}
