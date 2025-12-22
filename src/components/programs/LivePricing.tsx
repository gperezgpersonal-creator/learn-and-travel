'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/data/programs';
import { MOCK_PROGRAMS } from '@/services/mock/mockData';
import PaymentPlanSelector from '@/components/cart/PaymentPlanSelector';
import { Loader2, Check } from 'lucide-react';
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

    // --- Coupon Logic (Hooks moved to top) ---
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState<string | null>(null);
    const [activeCoupon, setActiveCoupon] = useState<{ code: string; discountType: 'percentage' | 'fixed'; discountValue: number } | null>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

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

    // --- Coupon Logic ---
    // (Hooks moved to top)

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setIsValidatingCoupon(true);
        setCouponError(null);
        setActiveCoupon(null);

        try {
            const res = await fetch('/api/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, programId: program?.id })
            });

            const data = await res.json();

            if (data.valid) {
                setActiveCoupon({
                    code: data.code,
                    discountType: data.discountType,
                    discountValue: Number(data.discountValue)
                });
                setCouponError(null);
            } else {
                setCouponError(data.message || 'Cupón inválido');
                setActiveCoupon(null);
            }
        } catch (err) {
            setCouponError('Error al validar cupón');
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    // Calculate Discounted Prices
    const getDiscountedPrice = (originalPrice: number) => {
        if (!activeCoupon) return originalPrice;

        let finalPrice = originalPrice;
        if (activeCoupon.discountType === 'percentage') {
            finalPrice = originalPrice * (1 - activeCoupon.discountValue / 100);
        } else if (activeCoupon.discountType === 'fixed') {
            // Apply fixed discount distributed? Or just subtract?
            // Usually fixed discount is per transaction. 
            // For simplicity in this specific "Program Price" context:
            // If it's the Total Price, we subtract fully. 
            // If it's "Apartado", maybe we don't discount the deposit? 
            // LET'S DECIDE: Discount applies to the base price.
            // But here we are passing plans to the selector. 
            // Let's assume the discount applies to the TOTAL program price.
            // If we have plans, usually the Installments sum up to total.
            // This is complex for Payment Plans. 
            // STRATEGY: 
            // 1. "Pago Total" (Plan index 0) gets the full discount.
            // 2. "Apartado" (Plan index 1) - DO NOT DISCOUNT Deposit usually? 
            //    Or maybe yes? Let's assume NO discount on deposit for now unless specified.
            //    ACTUALLY: User wants "Discount on the program".
            //    So "Pago Total" definitely drops.
            //    Installments: Should we re-calculate? 
            //    If we just change the "Pago Total" plan price, that's the most critical one.
            //    The user can contact sales for custom plans if using a coupon?
            //    Let's only apply to "Pago Total" for now to be safe, OR apply percentage to ALL plans?
            //    Percentage is safer to apply to all (e.g. 10% off everything).
            //    Fixed is tricky (e.g. $500 off).

            finalPrice = Math.max(0, originalPrice - activeCoupon.discountValue);
        }
        return finalPrice;
    };

    // Apply discount to plans
    const discountedPlans = program && program.plans ? program.plans.map((p: any) => {
        // Strategy: Apply discount to 'Pago Total' ALWAYS.
        // For 'Apartado' (Deposit), usually we keep it fixed? 
        // Let's ask: "Apartado" is usually small ($50). 
        // If discount is $100, Apartado becomes negative? 
        // SAFE BET: Only apply discount to plans with price > discountValue (for fixed)
        // or apply to all for percentage.
        // BUT for 'Apartado', usually it's a fixed reservation fee. 
        // Let's SKIP discount on 'Apartado' (usually index 1 or name contains 'Apartado') 
        // unless it's a huge percentage.
        // Actually, let's keep it simple: Apply to ALL plans for Percentage.
        // Apply to plans > value for Fixed.

        // Filter: Don't discount 'Apartado' if it's small.
        const isDeposit = p.name.toLowerCase().includes('apartado');
        if (isDeposit && activeCoupon && activeCoupon.discountType === 'fixed') {
            return p; // Don't reduce deposit with fixed amount (e.g. $500 off main price, but deposit is $50)
        }

        return {
            ...p,
            price: getDiscountedPrice(p.price)
        };
    }) : [];

    // Also discount the main display price
    const displayPrice = program ? getDiscountedPrice(program.price) : 0;

    return (
        <div className="w-full">
            {showTitle && program && (
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-widest text-[#FFD700] font-bold mb-2">Inversión Total {activeCoupon && '(Con Descuento)'}</p>
                    <div className="flex flex-col items-center justify-center">
                        {activeCoupon && (
                            <span className="text-xl text-slate-400 line-through decoration-red-500 mb-1">
                                ${program.price.toLocaleString()} {program.currency}
                            </span>
                        )}
                        <div className="text-6xl font-bold font-serif text-white mb-4">
                            ${displayPrice.toLocaleString()} <span className="text-2xl font-sans font-normal text-slate-400">{program.currency || 'USD'}</span>
                        </div>
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
                        plans={discountedPlans.length > 0 ? discountedPlans : program.plans || []}
                        highlightDeposit={id === '84-ORL2026' || program.id === '84-ORL2026'}
                    />
                </div>

                {/* --- COUPON INPUT --- */}
                <div className="mt-6 pt-6 border-t border-slate-200/20">
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        ¿Tienes un cupón de descuento?
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="CÓDIGO"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={!!activeCoupon}
                            className={`flex-grow p-3 rounded-lg border text-sm font-bold tracking-widest uppercase outline-none focus:ring-2 focus:ring-[#FFD700] transition-all
                                ${variant === 'dark'
                                    ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-600'
                                    : 'bg-white border-slate-200 text-[#122045] placeholder-slate-300'
                                }
                                ${activeCoupon ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        />
                        {activeCoupon ? (
                            <button
                                onClick={() => { setActiveCoupon(null); setCouponCode(''); }}
                                className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all"
                            >
                                <span className="text-xs font-bold">X</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleApplyCoupon}
                                disabled={!couponCode || isValidatingCoupon}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all
                                    ${isValidatingCoupon
                                        ? 'bg-slate-500 cursor-not-allowed opacity-50'
                                        : 'bg-[#FFD700] text-[#122045] hover:bg-yellow-400 shadow-lg hover:shadow-yellow-400/20'
                                    }
                                `}
                            >
                                {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APLICAR'}
                            </button>
                        )}
                    </div>

                    {/* Feedback Messages */}
                    {couponError && (
                        <p className="mt-2 text-xs font-bold text-red-500 animate-pulse">
                            {couponError}
                        </p>
                    )}
                    {activeCoupon && (
                        <p className="mt-2 text-xs font-bold text-green-500 flex items-center gap-1">
                            <Check className="w-3 h-3" /> ¡Cupón aplicado correctamente!
                        </p>
                    )}
                </div>

                <p className={`text-center text-[10px] mt-4 ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Datos actualizados en tiempo real. | Source: {program.id && !('mock' in program) ? 'DB Live' : 'Static Fallback'} | ID: {id || slug}
                </p>
            </div>
        </div>
    );
}
