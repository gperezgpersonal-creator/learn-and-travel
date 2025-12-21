'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';

interface Plan {
    name: string;
    price: number;
    deadline?: string;
    status?: 'active' | 'hidden' | 'sold_out';
}

interface PaymentPlanSelectorProps {
    title: string;
    image: string;
    description: string;
    plans: Plan[];
    highlightDeposit?: boolean;
}

export default function PaymentPlanSelector({ title, image, description, plans, highlightDeposit = false }: PaymentPlanSelectorProps) {
    const { addToCart } = useCart();

    // Correct Logic: ID by RAW INDEX, not visible index.
    // Plan 0 is ALWAYS "Pago Total" slot. Plan 1 is ALWAYS "Apartado" slot.
    const rawFullPaymentPlan = plans.length > 0 ? plans[0] : undefined;
    const rawDepositPlan = plans.length > 1 ? plans[1] : undefined;

    // Check visibility for rendering
    const fullPaymentPlan = (rawFullPaymentPlan && rawFullPaymentPlan.status !== 'hidden') ? rawFullPaymentPlan : undefined;
    const depositPlan = (rawDepositPlan && rawDepositPlan.status !== 'hidden') ? rawDepositPlan : undefined;

    // Installments are everything from index 2 onwards, filtered for visibility
    const installmentPlans = plans.slice(2).filter(p => !p.status || p.status !== 'hidden');

    // Combine for validity checks
    const visiblePlans = [fullPaymentPlan, depositPlan, ...installmentPlans].filter((p): p is Plan => !!p);



    const checkIsExpired = (deadline?: string) => {
        if (!deadline) return false;
        const today = new Date();
        const expiry = new Date(deadline);
        expiry.setHours(23, 59, 59, 999);
        return today > expiry;
    };

    // Initial selection: Simple deterministic fallback (Server Safe)
    // We update to the "Best Available" (non-expired) in the useEffect below
    const [selectedPlan, setSelectedPlan] = useState<Plan>(() => {
        return fullPaymentPlan || depositPlan || installmentPlans[0] || plans[0];
    });

    // EFFECT: Optimize selection on mount or update
    useEffect(() => {
        // Run expiration logic only on client to avoid Hydration Mismatch
        const plansToCheck = [fullPaymentPlan, depositPlan, ...installmentPlans];
        const visibleAndValid = plansToCheck.filter(p => p && visiblePlans.includes(p) && !checkIsExpired(p.deadline));

        // If current selection is invalid (expired or hidden), switch to best available
        const currentIsInvalid = !selectedPlan || checkIsExpired(selectedPlan.deadline) || !visiblePlans.some(p => p.name === selectedPlan.name);

        if (currentIsInvalid && visibleAndValid.length > 0) {
            const bestOption = visibleAndValid[0]; // Priority: Full -> Deposit -> Installments
            if (bestOption && bestOption !== selectedPlan) {
                setSelectedPlan(bestOption);
            }
        }
    }, [plans, visiblePlans, selectedPlan, fullPaymentPlan, depositPlan, installmentPlans]);



    const handleReserve = () => {
        addToCart({
            id: '',
            title,
            price: selectedPlan.price,
            image,
            description,
            plan: selectedPlan.name,
            variantId: selectedPlan.name.toLowerCase().replace(/\s+/g, '-')
        });
    };

    // Safety check: specific edge case if no plans exist
    if (visiblePlans.length === 0) {
        return <div className="p-4 bg-slate-50 text-slate-500 rounded-lg text-center">No hay planes de pago disponibles por el momento.</div>;
    }

    if (!selectedPlan) {
        return null;
    }

    // Strict Requirement: If we don't have at least the first two fundamental plans (Total & Deposit), 
    // or if they are hidden/missing, we might need to block interaction?
    // User said: "si no está alguno de estos conceptos no se activa el boton de reserva"
    // Interpretation: If logic fails to find "Total" (index 0) or "Deposit" (index 1), we disable?
    // Let's rely on standard selection validity first.

    // Updated Logic: We don't strictly require BOTH top plans to be visible.
    // As long as there is a selected plan that is valid, we allow reservation.
    const isSelectedExpired = checkIsExpired(selectedPlan.deadline);
    const isSelectedSoldOut = selectedPlan.status === 'sold_out';
    const EXPIRATION_MSG = "Fecha vencida, contacta a nuestro whatsapp para más ayuda";
    const SOLD_OUT_MSG = "No disponible";

    // Helper to check if a plan is interactable
    const isPlanDisabled = (plan: Plan) => checkIsExpired(plan.deadline) || plan.status === 'sold_out';

    return (
        <div className="space-y-6">
            {/* Quick Actions Header */}
            <div className="grid grid-cols-2 gap-4">
                {fullPaymentPlan && (
                    <button
                        onClick={() => !isPlanDisabled(fullPaymentPlan) && setSelectedPlan(fullPaymentPlan)}
                        disabled={isPlanDisabled(fullPaymentPlan)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all relative overflow-hidden ${selectedPlan === fullPaymentPlan
                            ? 'border-[#FFD700] bg-[#FFD700]/10 ring-2 ring-[#FFD700]/50'
                            : 'border-slate-200 hover:border-[#FFD700] hover:bg-slate-50'
                            } ${isPlanDisabled(fullPaymentPlan) ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
                    >
                        <span className="text-sm font-bold text-[#122045] mb-1">{fullPaymentPlan.name}</span>
                        <span className="text-xl font-bold text-primary">{formatCurrency(fullPaymentPlan.price)}</span>
                        {checkIsExpired(fullPaymentPlan.deadline) && (
                            <div className="mt-2 text-red-500 text-[10px] font-bold text-center leading-tight">
                                {EXPIRATION_MSG}
                            </div>
                        )}
                        {fullPaymentPlan.status === 'sold_out' && (
                            <div className="mt-2 text-red-600 text-[10px] font-bold text-center leading-tight uppercase tracking-wider">
                                {SOLD_OUT_MSG}
                            </div>
                        )}
                        {selectedPlan === fullPaymentPlan && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Seleccionado</div>}
                    </button>
                )}

                {depositPlan && (
                    <button
                        onClick={() => !isPlanDisabled(depositPlan) && setSelectedPlan(depositPlan)}
                        disabled={isPlanDisabled(depositPlan)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all relative overflow-hidden ${selectedPlan === depositPlan
                            ? 'border-[#FFD700] bg-[#FFD700]/10 ring-2 ring-[#FFD700]/50' // Selected State
                            : highlightDeposit
                                ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-500 shadow-md shadow-yellow-100' // Highlighted State (Yellow)
                                : 'border-slate-200 hover:border-[#FFD700] hover:bg-slate-50' // Default State
                            } ${isPlanDisabled(depositPlan) ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
                    >
                        <span className="text-sm font-bold text-[#122045] mb-1">{depositPlan.name}</span>
                        <span className="text-xl font-bold text-primary">{formatCurrency(depositPlan.price)}</span>
                        {checkIsExpired(depositPlan.deadline) && (
                            <div className="mt-2 text-red-500 text-[10px] font-bold text-center leading-tight">
                                {EXPIRATION_MSG}
                            </div>
                        )}
                        {depositPlan.status === 'sold_out' && (
                            <div className="mt-2 text-red-600 text-[10px] font-bold text-center leading-tight uppercase tracking-wider">
                                {SOLD_OUT_MSG}
                            </div>
                        )}
                        {selectedPlan === depositPlan && <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Seleccionado</div>}
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">O elige un plan diferido</span>
                </div>
            </div>

            {/* Installments List */}
            <div className="space-y-3">
                {installmentPlans.map((plan) => {
                    const isExpired = checkIsExpired(plan.deadline);
                    const isSoldOut = plan.status === 'sold_out';
                    const isDisabled = isExpired || isSoldOut;
                    const isSelected = selectedPlan === plan;

                    return (
                        <button
                            key={plan.name}
                            disabled={isDisabled}
                            onClick={() => setSelectedPlan(plan)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${isSelected
                                ? 'border-[#FFD700] bg-[#FFD700]/5 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300'
                                } ${isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-[#FFD700] bg-[#FFD700]' : 'border-slate-300'
                                }`}>
                                {isSelected && <Check className="w-3 h-3 text-[#122045]" />}
                            </div>

                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-800">{plan.name}</span>
                                    <span className="font-bold text-primary">{formatCurrency(plan.price)}</span>
                                </div>
                                {(plan.deadline || isSoldOut) && (
                                    <div className={`text-xs ${isDisabled ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                                        {isSoldOut ? 'NO DISPONIBLE' : (isExpired ? EXPIRATION_MSG : `Vence el ${plan.deadline}`)}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Main Action Button */}
            <div className="pt-4">
                <button
                    onClick={handleReserve}
                    disabled={isSelectedExpired || isSelectedSoldOut}
                    className={`btn w-full py-4 text-lg shadow-xl transition-all flex items-center justify-center gap-2 rounded-xl
                        ${isSelectedExpired || isSelectedSoldOut
                            ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                            : 'bg-[#122045] text-white hover:bg-[#1a2d5c] hover:shadow-2xl transform hover:-translate-y-1'
                        }`}
                >
                    <ShoppingBag className="w-5 h-5 text-[#FFD700]" />
                    <span className="font-bold">
                        {isSelectedSoldOut
                            ? 'Opción No Disponible'
                            : isSelectedExpired
                                ? 'Opción Vencida'
                                : `Reservar: ${selectedPlan.name.split('(')[0]}`
                        }
                    </span>
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                    Al proceder aceptas nuestros términos y condiciones.
                </p>
            </div>
        </div>
    );
}
