'use client';

import { useState } from 'react';
import FadeIn from '@/components/ui/FadeIn';
import { Plus, Briefcase, CheckCircle } from 'lucide-react';

export default function PartnerDashboard() {
    const [offers, setOffers] = useState<{ id: string; title: string; status: string }[]>([
        { id: '1', title: 'Summer Internship at Tech Corp', status: 'active' },
        { id: '2', title: 'Marketing Workshop Series', status: 'pending' }
    ]);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        const newOffer = {
            id: Date.now().toString(),
            title: 'New Proposal',
            status: 'pending'
        };
        setOffers([...offers, newOffer]);
        setShowForm(false);
    };

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Partner Portal</h1>
                        <p className="text-slate-500">Manage your program offers and proposals.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Proposal
                    </button>
                </div>
            </FadeIn>

            {showForm && (
                <FadeIn>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 mb-8 relative">
                        <h2 className="text-xl font-bold text-primary mb-4">Submit New Proposal</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Title</label>
                                <input type="text" placeholder="e.g., Advanced Robotics Workshop" className="w-full px-4 py-2 rounded-lg border border-slate-200" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Description</label>
                                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 h-32" placeholder="Describe the program details..." required></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit for Review</button>
                            </div>
                        </form>
                    </div>
                </FadeIn>
            )}

            <div className="grid gap-4">
                {offers.map((offer, index) => (
                    <FadeIn key={offer.id} delay={index * 0.1}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 p-3 rounded-lg text-slate-500">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{offer.title}</h3>
                                    <p className="text-xs text-slate-400">ID: {offer.id}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${offer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {offer.status}
                            </span>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>
    );
}
