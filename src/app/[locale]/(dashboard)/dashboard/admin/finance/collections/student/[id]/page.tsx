'use client';

import { useEffect, useState, use } from 'react';
import { FinanceService, Student, LedgerEntry } from '@/services/supabase/financeService';
import { Loader2, ArrowLeft, Plus, DollarSign } from 'lucide-react';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';
import LedgerTable from '../../components/LedgerTable';

export default function StudentFinancePage({ params }: { params: Promise<{ id: string }> }) {
    // Correctly unwrap params using React.use()
    const { id } = use(params);

    const [student, setStudent] = useState<Student | null>(null);
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Manual Charge/Payment State
    const [showChargeForm, setShowChargeForm] = useState(false);
    const [transactionType, setTransactionType] = useState<'charge' | 'payment'>('charge');
    const [chargeAmount, setChargeAmount] = useState('');
    const [chargeConcept, setChargeConcept] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [studentData, ledgerData] = await Promise.all([
                FinanceService.getStudentById(id),
                FinanceService.getStudentLedger(id)
            ]);
            setStudent(studentData);
            setLedger(ledgerData);
        } catch (error) {
            console.error('Failed to load student data', error);
        } finally {
            setLoading(false);
        }
    };

    const openTransactionModal = (type: 'charge' | 'payment') => {
        setTransactionType(type);
        setChargeConcept('');
        setChargeAmount('');
        setShowChargeForm(true);
    };

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chargeAmount || !chargeConcept) return;

        setSubmitting(true);
        try {
            if (transactionType === 'charge') {
                await FinanceService.addCharge(id, parseFloat(chargeAmount), chargeConcept);
            } else {
                // Manual payment (Cash/Transfer)
                await FinanceService.addPayment(id, parseFloat(chargeAmount), chargeConcept, { method: 'manual' });
            }

            await loadData(); // Refresh all data
            setShowChargeForm(false);
            setChargeAmount('');
            setChargeConcept('');
        } catch (error) {
            console.error('Failed to process transaction', error);
            alert('Failed to process transaction.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

    if (!student) return <div className="p-8 text-center">Student not found</div>;

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard/admin/finance/collections" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-slate-900">{student.first_name} {student.last_name}</h1>
                        <p className="text-slate-500 text-sm">{student.human_id} • {student.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-full flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 uppercase">Current Balance</p>
                                <p className={`text-4xl font-bold mt-2 ${(student.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ${(student.balance || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {(student.balance || 0) > 0 ? 'Outstanding Debt' : 'Fully Paid / Credit'}
                                </p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-sm text-slate-600">Total Charged: <span className="font-semibold">${(student.total_charges || 0).toLocaleString()}</span></p>
                                <p className="text-sm text-slate-600">Total Paid: <span className="font-semibold text-green-600">${(student.total_payments || 0).toLocaleString()}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => openTransactionModal('charge')}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl p-4 shadow-sm flex items-center justify-center gap-3 transition-colors flex-1"
                        >
                            <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-red-700" />
                            </div>
                            <span className="font-semibold">Add Charge (Deuda)</span>
                        </button>

                        <button
                            onClick={() => openTransactionModal('payment')}
                            className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl p-4 shadow-sm flex items-center justify-center gap-3 transition-colors flex-1"
                        >
                            <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-green-700" />
                            </div>
                            <span className="font-semibold">Register Payment (Abono)</span>
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Financial Ledger</h3>
                    <LedgerTable entries={ledger} />
                </div>
            </FadeIn>

            {/* Manual Charge/Payment Form Modal */}
            {showChargeForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                {transactionType === 'charge' ? 'Add Manual Charge' : 'Register Manual Payment'}
                            </h2>
                            <button onClick={() => setShowChargeForm(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <form onSubmit={handleTransactionSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Concept</label>
                                <input
                                    required
                                    type="text"
                                    placeholder={transactionType === 'charge' ? "e.g. Late Fee, Uniform..." : "e.g. Cash, Bank Transfer..."}
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                    value={chargeConcept}
                                    onChange={e => setChargeConcept(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
                                        value={chargeAmount}
                                        onChange={e => setChargeAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowChargeForm(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${transactionType === 'charge' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    {submitting ? 'Processing...' : (transactionType === 'charge' ? 'Add Charge' : 'Register Payment')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
