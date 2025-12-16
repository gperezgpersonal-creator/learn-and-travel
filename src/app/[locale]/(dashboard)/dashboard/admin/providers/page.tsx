'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/mock/adminService';
import { Provider, Agreement, MOCK_PROVIDERS, MOCK_AGREEMENTS } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import {
    Briefcase, FileText, Phone, Globe, Mail,
    Plus, Search, Filter, ExternalLink
} from 'lucide-react';

export default function ProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [agreements, setAgreements] = useState<Agreement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setProviders(MOCK_PROVIDERS);
            setAgreements(MOCK_AGREEMENTS);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) return <div className="p-8">Loading supply chain...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Supply Chain</h1>
                        <p className="text-slate-500">Manage global partners and service agreements.</p>
                    </div>
                    <button className="btn btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Provider
                    </button>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Provider Directory */}
                <div className="md:col-span-2 space-y-6">
                    <FadeIn delay={0.1}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-slate-400" /> Partner Directory
                                </h3>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Search className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Filter className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {providers.map((provider) => (
                                    <div key={provider.id} className="p-6 hover:bg-slate-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-lg text-slate-800">{provider.name}</h4>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${provider.type === 'transport' ? 'bg-blue-100 text-blue-700' :
                                                    provider.type === 'accommodation' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-purple-100 text-purple-700'
                                                }`}>
                                                {provider.type}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 mt-4">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-300" /> {provider.contactPhone}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-slate-300" /> {provider.contactEmail}
                                            </div>
                                            <div className="flex items-center gap-2 col-span-2">
                                                <Globe className="w-4 h-4 text-slate-300" />
                                                <a href={provider.website} target="_blank" className="hover:text-primary hover:underline flex items-center gap-1">
                                                    {provider.website.replace('https://', '')} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Active Agreements */}
                <div className="md:col-span-1">
                    <FadeIn delay={0.2}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-full">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-400" /> Active Agreements
                            </div>
                            <div className="p-4 space-y-4">
                                {agreements.map((agreement) => (
                                    <div key={agreement.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-green-50 p-2 rounded text-green-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">{agreement.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">Valid until {agreement.validTo}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-2 text-center text-sm text-primary font-bold hover:bg-primary/5 rounded-lg transition-colors">
                                    View Expired Contracts
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
