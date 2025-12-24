'use client';

import { LedgerEntry } from '@/services/supabase/financeService';
import { ArrowDownLeft, ArrowUpRight, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface LedgerTableProps {
    entries: LedgerEntry[];
    onReverse?: (entry: LedgerEntry) => Promise<void>;
}

export default function LedgerTable({ entries, onReverse }: LedgerTableProps) {
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleReverse = async (entry: LedgerEntry) => {
        if (!onReverse) return;

        const isStripe = entry.metadata?.source === 'stripe';
        const confirmMessage = isStripe
            ? '¿Quieres devolver este pago al Buzón de Stripe para asignarlo nuevamente?'
            : '¿Estás seguro de ELIMINAR permanentemente este registro manual?';

        if (window.confirm(confirmMessage)) {
            setProcessingId(entry.id);
            try {
                await onReverse(entry);
            } catch (error: any) {
                console.error('Error reversing:', error);
                const msg = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
                alert(`Error al revertir el pago: ${msg}`);
            } finally {
                setProcessingId(null);
            }
        }
    };

    if (entries.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No transactions found.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Concept</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                        {onReverse && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-500">
                                {new Date(entry.created_at).toLocaleDateString()} <span className="text-xs text-slate-400">{new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </td>
                            <td className="px-6 py-4">
                                {entry.type === 'charge' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <ArrowUpRight className="w-3 h-3" /> Charge
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <ArrowDownLeft className="w-3 h-3" /> Payment
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                                {entry.concept}
                                {entry.metadata?.source === 'stripe' && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded border border-indigo-100">Stripe</span>
                                )}
                            </td>
                            <td className={`px-6 py-4 text-sm font-bold text-right ${entry.type === 'charge' ? 'text-slate-900' : 'text-green-600'}`}>
                                {entry.type === 'charge' ? '+' : '-'}${entry.amount.toLocaleString()}
                            </td>
                            {onReverse && (
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleReverse(entry)}
                                        disabled={!!processingId}
                                        className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                        title={entry.metadata?.source === 'stripe' ? "Devolver al Buzón (Unreconcile)" : "Eliminar registro manual"}
                                    >
                                        {processingId === entry.id ? (
                                            <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                                        ) : entry.metadata?.source === 'stripe' ? (
                                            <RotateCcw className="w-4 h-4" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
