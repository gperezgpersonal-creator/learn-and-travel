'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, Tag, Calendar, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';
import { Link, useRouter } from '@/navigation';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCoupons(data || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este cupón?')) return;

        try {
            const { error } = await supabase
                .from('coupons')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
            alert('Error al eliminar cupón');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Cupones de Descuento</h1>
                <Link
                    href="/dashboard/admin/coupons/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Cupón
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                    <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No hay cupones creados</h3>
                    <p className="text-slate-500 mb-6">Crea el primer cupón para ofrecer descuentos.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left p-4 font-semibold text-slate-600 text-sm">Código</th>
                                <th className="text-left p-4 font-semibold text-slate-600 text-sm">Descuento</th>
                                <th className="text-left p-4 font-semibold text-slate-600 text-sm">Estado</th>
                                <th className="text-left p-4 font-semibold text-slate-600 text-sm">Uso</th>
                                <th className="text-left p-4 font-semibold text-slate-600 text-sm">Vencimiento</th>
                                <th className="text-right p-4 font-semibold text-slate-600 text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 font-mono tracking-wider">{coupon.code}</span>
                                            {coupon.program_id && (
                                                <span className="text-xs text-slate-400">Prog: {coupon.program_id}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {coupon.active ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <CheckCircle className="w-4 h-4" /> Activo
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                                                <XCircle className="w-4 h-4" /> Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {coupon.used_count} / {coupon.max_uses || '∞'}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {coupon.expiration_date ? new Date(coupon.expiration_date).toLocaleDateString() : 'Sin fecha'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/dashboard/admin/coupons/edit/${coupon.id}`}
                                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
