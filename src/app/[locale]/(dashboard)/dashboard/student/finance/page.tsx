'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/mock/studentService';
import { Transaction } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { CreditCard, ShoppingBag, Plus, DollarSign, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingItem, setAddingItem] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            // Fetching for exemplary student to show a clean ledger, or problematic to show overdue
            // Let's stick with 'student-exemplary' for a better financial view, or mix it up.
            const txs = await studentService.getTransactions('student-exemplary');
            setTransactions(txs);
            setLoading(false);
        };
        loadData();
    }, []);

    const totalCost = transactions.filter(t => t.type === 'charge').reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = transactions.filter(t => t.type === 'payment').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalCost - totalPaid;

    const marketplaceItems = [
        { id: 'item-1', name: 'Cancellation Insurance', price: 150, image: '🛡️' },
        { id: 'item-2', name: 'Extra Luggage (23kg)', price: 80, image: '🧳' },
        { id: 'item-3', name: 'L&T Official Hoodie', price: 45, image: '👕' },
        { id: 'item-4', name: 'London SIM Card', price: 25, image: '📱' },
    ];

    const handleAddItem = async (item: typeof marketplaceItems[0]) => {
        setAddingItem(item.id);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

        const newTx: Transaction = {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            id: `tx-${Date.now()}`,
            userId: 'student-exemplary',
            amount: item.price,
            date: new Date().toISOString().split('T')[0],
            concept: item.name,
            status: 'pending',
            type: 'charge'
        };

        setTransactions(prev => [...prev, newTx]);
        setAddingItem(null);
    };

    if (loading) return <div className="p-8">Loading finance data...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Finance Center</h1>
                        <p className="text-slate-500">Track your payments and manage trip add-ons.</p>
                    </div>
                </div>
            </FadeIn>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <FadeIn delay={0.1}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-sm text-slate-500 font-bold uppercase mb-2">Total Trip Cost</div>
                        <div className="text-3xl font-bold text-slate-800">${totalCost.toLocaleString()}</div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-sm text-slate-500 font-bold uppercase mb-2">Total Paid</div>
                        <div className="text-3xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-sm text-slate-500 font-bold uppercase mb-2">Outstanding Balance</div>
                        <div className="text-3xl font-bold text-primary">${balance.toLocaleString()}</div>
                        {balance > 0 && (
                            <button className="mt-4 w-full btn btn-primary py-2 text-sm flex items-center justify-center gap-2">
                                <CreditCard className="w-4 h-4" /> Pay Now
                            </button>
                        )}
                    </div>
                </FadeIn>
            </div>

            {/* Ledger */}
            <FadeIn delay={0.4}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 font-bold text-slate-700">
                        Account Statement
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Concept</th>
                                    <th className="p-4 text-right">Charge</th>
                                    <th className="p-4 text-right">Payment</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-slate-500">{tx.date}</td>
                                        <td className="p-4 font-medium text-slate-800">{tx.concept}</td>
                                        <td className="p-4 text-right text-slate-800">
                                            {tx.type === 'charge' ? `$${tx.amount.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="p-4 text-right text-green-600 font-bold">
                                            {tx.type === 'payment' ? `$${tx.amount.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${tx.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                tx.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </FadeIn>

            {/* Marketplace */}
            <FadeIn delay={0.5}>
                <div className="bg-slate-900 rounded-xl p-8 text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <ShoppingBag className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-2xl font-serif font-bold">Trip Add-ons</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {marketplaceItems.map((item) => (
                            <div key={item.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-center group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.image}</div>
                                <h3 className="font-bold mb-1">{item.name}</h3>
                                <div className="text-yellow-400 font-bold text-xl mb-4">${item.price}</div>
                                <button
                                    onClick={() => handleAddItem(item)}
                                    disabled={addingItem === item.id}
                                    className="w-full btn bg-white text-slate-900 hover:bg-slate-100 py-2 text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    {addingItem === item.id ? 'Adding...' : <><Plus className="w-4 h-4" /> Add to Trip</>}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
