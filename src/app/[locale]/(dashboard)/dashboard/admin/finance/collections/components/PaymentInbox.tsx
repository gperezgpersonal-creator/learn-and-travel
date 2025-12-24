'use client';

import { useEffect, useState } from 'react';
import { FinanceService, Payment, Student } from '@/services/supabase/financeService';
import { Loader2, Search, CheckCircle, AlertCircle, RefreshCw, PlusCircle } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import { Link } from '@/navigation';

export default function PaymentInbox() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Student[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [reconciling, setReconciling] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // New success state

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPayments();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length > 2) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await FinanceService.getPendingPayments();
            setPayments(data);
        } catch (err: any) {
            console.error('Failed to load payments', err);
            setError(err.message || JSON.stringify(err) || 'Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch('/api/admin/finance/sync-transactions', { method: 'POST' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            alert(`Sincronización completa: ${data.added} nuevos pagos encontrados.`);
            loadPayments();
        } catch (err: any) {
            console.error('Sync failed', err);
            alert('Error al sincronizar con Stripe');
        } finally {
            setSyncing(false);
        }
    };

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const results = await FinanceService.searchStudents(searchTerm);
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAssign = async (studentId: string) => {
        if (!selectedPayment) return;
        setReconciling(true);
        try {
            await FinanceService.reconcilePayment(selectedPayment.id, studentId);

            // Show success feedback
            setShowSuccess(true);

            // Wait briefly before closing
            setTimeout(async () => {
                await loadPayments();
                setSelectedPayment(null);
                setSearchTerm('');
                setSearchResults([]);
                setShowSuccess(false);
                setReconciling(false);
            }, 1500);

        } catch (error: any) {
            console.error('Reconciliation failed', error);
            // Handle standard Error objects where JSON.stringify returns {}
            const msg = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            alert(`Error al asignar pago: ${msg}`);
            setReconciling(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with Sync */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-slate-700 text-lg">Buzón de Pagos (Stripe)</h3>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">{payments.length} Pendientes</span>
                </div>
                <button
                    onClick={handleSync}
                    disabled={syncing || loading}
                    className="btn btn-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Sincronizando...' : 'Sincronizar con Stripe'}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Alumno</th>
                                <th className="px-6 py-3">ID / Matrícula</th>
                                <th className="px-6 py-3">Programa</th>
                                <th className="px-6 py-3 text-right">Monto</th>
                                <th className="px-6 py-3 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></td></tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500">
                                        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                                        <p>¡Todo al día! No hay pagos pendientes por asignar.</p>
                                    </td>
                                </tr>
                            ) : (
                                payments.map(payment => (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {// Check if timestamp is seconds or milliseconds
                                                payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A'
                                            }
                                            <div className="text-xs text-slate-400">
                                                {payment.created_at ? new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">
                                            <div className="font-medium text-slate-900">
                                                {payment.raw_data?.metadata?.studentName || payment.raw_data?.billing_details?.name || 'Cliente Desconocido'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {payment.raw_data?.billing_details?.email || payment.raw_data?.receipt_email || 'No email'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                            {payment.raw_data?.metadata?.studentId ? (
                                                <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">
                                                    {payment.raw_data.metadata.studentId}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">
                                                    ID: {payment.stripe_charge_id?.slice(-8)}...
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {payment.raw_data?.description || payment.raw_data?.metadata?.program || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-green-700">
                                            ${payment.amount.toLocaleString()} <span className="text-xs font-normal text-slate-500">{payment.currency.toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedPayment(payment)}
                                                className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Asignar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">

                        {/* Success Overlay */}
                        {showSuccess && (
                            <div className="absolute inset-0 bg-green-50 z-50 flex flex-col items-center justify-center animate-in fade-in duration-200">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                                <h3 className="text-xl font-bold text-green-700">¡Pago Asignado!</h3>
                                <p className="text-green-600">Actualizando lista...</p>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Asignar Pago</h3>
                                <p className="text-sm text-slate-500">Selecciona el alumno para asignar este pago.</p>
                            </div>
                            <button onClick={() => setSelectedPayment(null)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Datos del Pago</p>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-slate-800">
                                            {selectedPayment.raw_data?.metadata?.studentName || selectedPayment.raw_data?.billing_details?.name || 'Nombre Desconocido'}
                                        </p>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(selectedPayment.raw_data?.metadata?.studentName || selectedPayment.raw_data?.billing_details?.name || '')}
                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                            title="Copiar Nombre"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                                            {selectedPayment.raw_data?.metadata?.studentId || selectedPayment.stripe_charge_id}
                                        </p>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(selectedPayment.raw_data?.metadata?.studentId || selectedPayment.stripe_charge_id || '')}
                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                            title="Copiar ID"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-600">${selectedPayment.amount.toLocaleString()} <span className="text-sm font-normal text-slate-500">{selectedPayment.currency.toUpperCase()}</span></p>
                                    <p className="text-xs text-slate-400 mt-1">{selectedPayment.raw_data?.description || 'Sin programa'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Buscar Alumno</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Nombre, Correo o Matrícula..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-lg bg-white">
                                {isSearching ? (
                                    <div className="p-4 text-center text-slate-400 text-sm">Buscando...</div>
                                ) : searchResults.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {searchResults.map(student => (
                                            <div
                                                key={student.id}
                                                className="w-full p-3 hover:bg-slate-50 flex justify-between items-center group transition-colors"
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-800">{student.first_name} {student.last_name}</p>
                                                    <p className="text-xs text-slate-500">{student.human_id} • {student.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAssign(student.id)}
                                                    disabled={reconciling}
                                                    className="px-3 py-1 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                                                >
                                                    Asignar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : searchTerm.length > 2 ? (
                                    <div className="p-4 text-center">
                                        <p className="text-slate-400 text-sm mb-2">No se encontraron alumnos.</p>
                                        <Link
                                            href="/dashboard/admin/students"
                                            className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                                        >
                                            <PlusCircle className="w-4 h-4" /> Crear nuevo alumno
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-slate-400 text-sm italic">
                                        Escribe para buscar o <Link href="/dashboard/admin/students" className="text-primary hover:underline not-italic">ve al directorio</Link> para crear uno nuevo.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
