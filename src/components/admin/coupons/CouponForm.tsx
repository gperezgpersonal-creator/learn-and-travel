
'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CouponFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CouponForm({ initialData, onSuccess, onCancel }: CouponFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        code: initialData?.code || '',
        discount_type: initialData?.discount_type || 'percentage',
        discount_value: initialData?.discount_value || 0,
        program_id: initialData?.program_id || '', // '84-ORL2026' or empty for all
        active: initialData?.active ?? true,
        max_uses: initialData?.max_uses || '',
        expiration_date: initialData?.expiration_date ? new Date(initialData.expiration_date).toISOString().split('T')[0] : ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                code: formData.code.toUpperCase().trim(), // Normalize code
                max_uses: formData.max_uses === '' ? null : Number(formData.max_uses),
                program_id: formData.program_id.trim() === '' ? null : formData.program_id.trim(),
                expiration_date: formData.expiration_date === '' ? null : new Date(formData.expiration_date).toISOString()
            };

            let result;
            if (initialData?.id) {
                // UPDATE
                result = await supabase
                    .from('coupons')
                    .update(payload)
                    .eq('id', initialData.id);
            } else {
                // CREATE
                result = await supabase
                    .from('coupons')
                    .insert([payload]);
            }

            if (result.error) throw result.error;
            onSuccess();
        } catch (err: any) {
            console.error('Error saving coupon:', err);
            setError(err.message || 'Error guardando el cupón');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* CODE */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Código del Cupón</label>
                    <input
                        required
                        type="text"
                        value={formData.code}
                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg uppercase tracking-wider font-bold"
                        placeholder="ej. VERANO2026"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* TYPE */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Descuento</label>
                        <select
                            value={formData.discount_type}
                            onChange={e => setFormData({ ...formData, discount_type: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        >
                            <option value="percentage">Porcentaje (%)</option>
                            <option value="fixed">Monto Fijo ($)</option>
                        </select>
                    </div>

                    {/* VALUE */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.discount_value}
                            onChange={e => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                </div>

                {/* PROGRAM ID (OPTIONAL) */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        ID del Programa (Opcional)
                        <span className="text-xs font-normal text-slate-500 ml-2">Dejar vacío para aplicar a todos</span>
                    </label>
                    <input
                        type="text"
                        value={formData.program_id}
                        onChange={e => setFormData({ ...formData, program_id: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-slate-600"
                        placeholder="ej. 84-ORL2026"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* EXPIRATION */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vencimiento (Opcional)</label>
                        <input
                            type="date"
                            value={formData.expiration_date}
                            onChange={e => setFormData({ ...formData, expiration_date: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                    </div>

                    {/* MAX USES */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Límite de Usos (Opcional)</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.max_uses}
                            onChange={e => setFormData({ ...formData, max_uses: e.target.value })}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            placeholder="Ilimitado"
                        />
                    </div>
                </div>

                {/* ACTIVE TOGGLE */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                        Cupón Activo
                    </label>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cupón
                </button>
            </div>
        </form>
    );
}
