'use client';

import { useState } from 'react';
import FadeIn from '@/components/ui/FadeIn';
import {
    DollarSign, CreditCard, TrendingUp, PieChart,
    CheckCircle, XCircle, AlertCircle, Save, Download,
    ArrowUpRight, ArrowDownRight, FileText, Package, PlusIcon, X
} from 'lucide-react';
import { MOCK_BUSINESS_TRANSACTIONS, MOCK_INVOICES, MOCK_INVENTORY_COSTS, MOCK_PROGRAMS, MOCK_CONTACTS, BusinessTransaction } from '@/services/mock/mockData';

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'receivables' | 'payables' | 'inventory'>('overview');

    // Local state for mockup functionality
    const [transactions, setTransactions] = useState<BusinessTransaction[]>(MOCK_BUSINESS_TRANSACTIONS);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [studentSearch, setStudentSearch] = useState(''); // Search state
    const [paymentForm, setPaymentForm] = useState({
        studentId: '',
        amount: '',
        concept: 'Tuition', // Default concept
        method: 'transfer'
    });

    // ... calculations ...

    // Filter students based on search
    const filteredStudents = MOCK_CONTACTS.filter(c =>
        (c.status === 'enrolled' || c.status === 'applied') &&
        (c.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            c.internalId?.toLowerCase().includes(studentSearch.toLowerCase()))
    );

    // ... handleRegisterPayment ...

    // Calculations based on local state
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const pendingPayables = MOCK_INVOICES.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

    const handleRegisterPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentForm.studentId || !paymentForm.amount) return;

        const student = MOCK_CONTACTS.find(c => c.id === paymentForm.studentId);

        const newTransaction: BusinessTransaction = {
            id: `tx-new-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount: Number(paymentForm.amount),
            type: 'income',
            category: 'Tuition',
            description: `${paymentForm.concept} - ${student?.name}`,
            status: 'completed',
            relatedId: paymentForm.studentId
        };

        setTransactions([newTransaction, ...transactions]);
        setShowPaymentModal(false);
        setPaymentForm({ studentId: '', amount: '', concept: '', method: 'transfer' });

        // Switch to overview to see the new transaction
        setActiveTab('overview');
    };

    // Helper to calculate paid amount for a student including new transactions
    const getStudentPaidAmount = (studentId: string) => {
        // Base mock paid amount (randomized in original code, fixed here for consistency in mockup)
        // In a real app, this would come from the database. 
        // For this mockup, we'll sum up all 'income' transactions related to this student.
        // Note: The original mock data didn't link all transactions to students perfectly, 
        // so we'll simulate a base amount + new transactions.

        const newPayments = transactions
            .filter(t => t.relatedId === studentId && t.type === 'income' && t.id.startsWith('tx-new-'))
            .reduce((acc, curr) => acc + curr.amount, 0);

        // Simulate base paid amount (just for demo consistency, usually 0 or random)
        const basePaid = 0;

        return basePaid + newPayments;
    };

    return (
        <div className="space-y-8 relative">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Financial Management</h1>
                        <p className="text-slate-500">Complete business administration system.</p>
                    </div>
                    <button className="btn btn-outline flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </FadeIn>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
                {['overview', 'receivables', 'payables', 'inventory'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 capitalize whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab === 'receivables' ? 'Accounts Receivable' : tab === 'payables' ? 'Accounts Payable' : tab}
                    </button>
                ))}
            </div>

            {/* OVERVIEW VIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <FadeIn delay={0.1}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-green-50 rounded-lg text-green-600"><ArrowUpRight className="w-6 h-6" /></div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                                </div>
                                <div className="text-3xl font-bold text-slate-800 mb-1">${totalIncome.toLocaleString()}</div>
                                <div className="text-sm text-slate-500">Total Income</div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-red-50 rounded-lg text-red-600"><ArrowDownRight className="w-6 h-6" /></div>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Last 30 days</span>
                                </div>
                                <div className="text-3xl font-bold text-slate-800 mb-1">${totalExpenses.toLocaleString()}</div>
                                <div className="text-sm text-slate-500">Total Expenses</div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><DollarSign className="w-6 h-6" /></div>
                                </div>
                                <div className="text-3xl font-bold text-slate-800 mb-1">${netProfit.toLocaleString()}</div>
                                <div className="text-sm text-slate-500">Net Profit</div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600"><AlertCircle className="w-6 h-6" /></div>
                                </div>
                                <div className="text-3xl font-bold text-slate-800 mb-1">${pendingPayables.toLocaleString()}</div>
                                <div className="text-sm text-slate-500">Pending Payables</div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Recent Transactions */}
                    <FadeIn delay={0.5}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="font-bold text-slate-700">Recent Transactions</h3>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4 text-right">Amount</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 text-slate-500">{tx.date}</td>
                                            <td className="p-4 font-bold text-slate-800">{tx.description}</td>
                                            <td className="p-4 text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{tx.category}</span></td>
                                            <td className={`p-4 text-right font-mono font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}>
                                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1 font-bold text-xs uppercase ${tx.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>
                </div>
            )}

            {/* RECEIVABLES VIEW */}
            {activeTab === 'receivables' && (
                <FadeIn>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Student Payments (Cobranza)</h3>
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="btn btn-primary text-sm flex items-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" /> Register Payment
                            </button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Program</th>
                                    <th className="p-4 text-right">Total Price</th>
                                    <th className="p-4 text-right">Paid</th>
                                    <th className="p-4 text-right">Balance</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_CONTACTS.filter(c => c.status === 'enrolled' || c.status === 'applied').map((contact) => {
                                    // Mock calculation
                                    const program = MOCK_PROGRAMS.find(p => p.id === contact.programInterest) || MOCK_PROGRAMS[0];
                                    const total = program?.price || 0;
                                    const paid = getStudentPaidAmount(contact.id);
                                    const balance = total - paid;

                                    return (
                                        <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-bold text-slate-800">
                                                {contact.internalId && <div className="text-xs font-bold text-primary font-mono mb-0.5">{contact.internalId}</div>}
                                                <div>{contact.name}</div>
                                            </td>
                                            <td className="p-4 text-slate-600">{program?.title}</td>
                                            <td className="p-4 text-right font-mono">${total.toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono text-green-600">${paid.toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono font-bold text-red-600">${balance.toLocaleString()}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-primary hover:underline text-xs font-bold">View Statement</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </FadeIn>
            )}

            {/* PAYABLES VIEW */}
            {activeTab === 'payables' && (
                <FadeIn>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Accounts Payable (Proveedores)</h3>
                            <button className="btn btn-primary text-sm flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Add Invoice</button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4">Provider / Description</th>
                                    <th className="p-4">Program</th>
                                    <th className="p-4">Due Date</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_INVOICES.map((inv) => {
                                    const program = MOCK_PROGRAMS.find(p => p.id === inv.programId);
                                    return (
                                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-bold text-slate-800">{inv.description}</td>
                                            <td className="p-4 text-slate-600">{program?.title}</td>
                                            <td className="p-4 text-slate-500">{inv.dueDate}</td>
                                            <td className="p-4 text-right font-mono text-slate-800">${inv.amount.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-primary hover:underline text-xs font-bold">Pay Now</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </FadeIn>
            )}

            {/* INVENTORY VIEW */}
            {activeTab === 'inventory' && (
                <FadeIn>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-700">Cost Breakdown</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4">Program</th>
                                    <th className="p-4">Item</th>
                                    <th className="p-4 text-right">Cost/Unit</th>
                                    <th className="p-4 text-right">Quantity</th>
                                    <th className="p-4 text-right">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_INVENTORY_COSTS.map((item, idx) => {
                                    const program = MOCK_PROGRAMS.find(p => p.id === item.programId);
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-bold text-slate-800">{program?.title}</td>
                                            <td className="p-4 text-slate-600">{item.item}</td>
                                            <td className="p-4 text-right font-mono">${item.costPerUnit.toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono">{item.quantity}</td>
                                            <td className="p-4 text-right font-mono font-bold text-slate-800">${item.totalCost.toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </FadeIn>
            )}

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Register New Payment</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleRegisterPayment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="Search by Name or ID..."
                                        value={studentSearch}
                                        onChange={(e) => {
                                            setStudentSearch(e.target.value);
                                            setPaymentForm({ ...paymentForm, studentId: '' }); // Reset selection on search change
                                        }}
                                    />
                                </div>
                                <div className="mt-2 border rounded-lg max-h-32 overflow-y-auto bg-slate-50">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map(c => (
                                            <div
                                                key={c.id}
                                                onClick={() => {
                                                    setPaymentForm({ ...paymentForm, studentId: c.id });
                                                    setStudentSearch(c.name); // Set search to name for visual confirmation
                                                }}
                                                className={`p-2 text-sm cursor-pointer hover:bg-blue-50 flex justify-between items-center ${paymentForm.studentId === c.id ? 'bg-blue-100 text-primary font-bold' : 'text-slate-600'}`}
                                            >
                                                <span>{c.name}</span>
                                                <span className="text-xs font-mono bg-white px-1 rounded border">{c.internalId}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-slate-400 text-center">No students found.</div>
                                    )}
                                </div>
                                {paymentForm.studentId && <p className="text-xs text-green-600 mt-1 font-bold">Selected: {MOCK_CONTACTS.find(c => c.id === paymentForm.studentId)?.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                    <input
                                        type="number"
                                        className="w-full pl-7 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="0.00"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Concept</label>
                                <select
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={paymentForm.concept}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, concept: e.target.value })}
                                    required
                                >
                                    <option value="Tuition">Tuition</option>
                                    <option value="Flight">Flight</option>
                                    <option value="Housing">Housing</option>
                                    <option value="Insurance">Insurance</option>
                                    <option value="Enrollment Fee">Enrollment Fee</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                <select
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={paymentForm.method}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                                >
                                    <option value="transfer">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Credit/Debit Card</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Register Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


