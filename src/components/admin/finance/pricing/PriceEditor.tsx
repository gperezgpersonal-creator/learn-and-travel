'use client';

import { useState } from 'react';
import { Program, Plan } from '@/services/mock/mockData';
import { ArrowLeft, Save, Plus, Trash2, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface PriceEditorProps {
    program: Program;
    onBack: () => void;
    onSave: (program: Program) => void;
}

export default function PriceEditor({ program, onBack, onSave }: PriceEditorProps) {
    const [formData, setFormData] = useState<Program>(() => {
        const deepCopy = JSON.parse(JSON.stringify(program));
        if (!deepCopy.plans) deepCopy.plans = [];
        // Ensure at least 2 slots for mandatory structure
        while (deepCopy.plans.length < 2) {
            deepCopy.plans.push({ name: '', price: 0, status: 'hidden' }); // Default to hidden if auto-added
        }
        // Pre-fill names if empty for clarity
        if (!deepCopy.plans[0].name) deepCopy.plans[0].name = "Pago de Contado";
        if (!deepCopy.plans[1].name) deepCopy.plans[1].name = "Apartado";

        return deepCopy;
    });
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (field: keyof Program, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handlePlanChange = (index: number, field: keyof Plan, value: any) => {
        const newPlans = [...(formData.plans || [])];
        newPlans[index] = { ...newPlans[index], [field]: value };
        setFormData(prev => ({ ...prev, plans: newPlans }));
        setHasChanges(true);
    };

    const addPlan = () => {
        setFormData(prev => ({
            ...prev,
            plans: [...(prev.plans || []), { name: 'Nuevo Plan', price: 0, status: 'active' }]
        }));
        setHasChanges(true);
    };

    const removePlan = (index: number) => {
        const newPlans = [...(formData.plans || [])];
        newPlans.splice(index, 1);
        setFormData(prev => ({ ...prev, plans: newPlans }));
        setHasChanges(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Volver a Programas
                </button>
                <button
                    onClick={() => onSave(formData)}
                    disabled={!hasChanges}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Pricing Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Precio Base
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Público ({formData.currency})</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', Number(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono text-lg"
                                />
                                <p className="text-xs text-slate-500 mt-1">Este es el precio "tachado" o precio total de referencia.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => handleChange('slug', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary outline-none font-mono text-sm"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Identificador en la URL. Debe ser: <strong>orlando-business-2026</strong>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Moneda</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => handleChange('currency', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary outline-none"
                                >
                                    <option value="USD">USD - Dólar Americano</option>
                                    <option value="MXN">MXN - Peso Mexicano</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - Libra Esterlina</option>
                                    <option value="CAD">CAD - Dólar Canadiense</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>
                            Los cambios realizados aquí se reflejarán inmediatamente en la página pública del programa y en el proceso de pago.
                        </p>
                    </div>
                </div>

                {/* Payment Plans */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Planes de Pago y Plazos
                            </h3>
                            <button
                                onClick={addPlan}
                                className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-primary/10"
                            >
                                <Plus className="w-4 h-4" /> Agregar Opción
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.plans?.map((plan, index) => (
                                <div key={index} className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-slate-50 border items-start md:items-center group hover:border-primary/30 transition-colors ${index < 2 ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100'
                                    }`}>
                                    <div className="flex-1 space-y-1 w-full">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-slate-500 uppercase">
                                                {index === 0 ? 'Concepto 1: Pago Total (Obligatorio)' :
                                                    index === 1 ? 'Concepto 2: Apartado (Obligatorio)' :
                                                        'Nombre del Concepto'}
                                            </label>
                                            {index < 2 && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 rounded-full">Fijo</span>}
                                        </div>
                                        <input
                                            type="text"
                                            value={plan.name}
                                            onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                                            placeholder={index === 0 ? "Ej. Pago de Contado" : index === 1 ? "Ej. Apartado" : "Ej. Plan Diferido"}
                                            className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-primary/50 outline-none text-sm font-medium"
                                        />
                                    </div>

                                    <div className="w-full md:w-32 space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Monto</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1.5 text-slate-400 text-xs">$</span>
                                            <input
                                                type="number"
                                                value={plan.price}
                                                onChange={(e) => handlePlanChange(index, 'price', Number(e.target.value))}
                                                className="w-full pl-5 pr-2 py-1.5 rounded border border-slate-300 focus:border-primary/50 outline-none text-sm font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full md:w-40 space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Fecha Límite</label>
                                        <input
                                            type="date"
                                            value={plan.deadline || ''}
                                            onChange={(e) => handlePlanChange(index, 'deadline', e.target.value)}
                                            className="w-full px-2 py-1.5 rounded border border-slate-300 focus:border-primary/50 outline-none text-sm"
                                        />
                                    </div>

                                    <div className="w-full md:w-32 space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Estado</label>
                                        <select
                                            value={plan.status || 'active'}
                                            onChange={(e) => handlePlanChange(index, 'status', e.target.value)}
                                            className={`w-full px-2 py-1.5 rounded border outline-none text-sm font-bold ${plan.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                plan.status === 'hidden' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                        >
                                            <option value="active">Activo</option>
                                            <option value="hidden">Oculto</option>
                                            <option value="sold_out">Agotado</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => removePlan(index)}
                                        disabled={index < 2}
                                        className={`p-2 rounded transition-colors self-end md:self-center ${index < 2 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                        title={index < 2 ? "Este plan es obligatorio" : "Eliminar opción"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
