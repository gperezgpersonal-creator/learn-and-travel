'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/utils/format';

interface Plan {
    name: string;
    price: number;
}

interface ReserveButtonProps {
    title: string;
    image: string;
    description: string;
    plans: Plan[];
}

export default function ReserveButton({ title, image, description, plans }: ReserveButtonProps) {
    const { addToCart } = useCart();
    const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
    const [isOpen, setIsOpen] = useState(false);

    const handleReserve = () => {
        addToCart({
            id: '', // Will be generated in context
            title,
            price: selectedPlan.price,
            image,
            description,
            plan: selectedPlan.name,
            variantId: selectedPlan.name.toLowerCase().replace(/\s+/g, '-')
        });
    };

    return (
        <div className="space-y-3">
            {/* Plan Selector */}
            {plans.length > 1 && (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white hover:border-primary transition-colors"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Plan de Pago</span>
                            <span className="font-bold text-slate-800">{selectedPlan.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">{formatCurrency(selectedPlan.price)}</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-lg shadow-xl z-20 overflow-hidden">
                            {plans.map((plan) => (
                                <button
                                    key={plan.name}
                                    onClick={() => {
                                        setSelectedPlan(plan);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between p-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-50 last:border-0"
                                >
                                    <span className="text-sm font-medium text-slate-700">{plan.name}</span>
                                    <span className="text-sm font-bold text-primary">{formatCurrency(plan.price)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={handleReserve}
                className="btn btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
                <ShoppingBag className="w-5 h-5" />
                Reserva: {selectedPlan.name}
            </button>
        </div>
    );
}
