'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Proposal, ProposalStatus } from '@/types/proposal';
import { Loader2, Plus, FileText, ExternalLink, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProposalsPage() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching proposals:', error);
        } else {
            setProposals(data || []);
        }
        setLoading(false);
    };

    const createNewProposal = async () => {
        setCreating(true);
        // Create a basic draft
        const { data, error } = await supabase
            .from('proposals')
            .insert({
                title: 'Nueva Propuesta',
                client_name: 'Cliente Nuevo',
                status: 'Draft',
                latest_version_number: 0
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating proposal:', error);
            alert('Error creating proposal');
            setCreating(false);
        } else if (data) {
            // Redirect to editor
            router.push(`/dashboard/admin/proposals/${data.id}/edit`);
        }
    };

    const statusColors: Record<ProposalStatus, string> = {
        'Draft': 'bg-slate-100 text-slate-600',
        'Sent': 'bg-blue-100 text-blue-800',
        'Approved': 'bg-green-100 text-green-800',
        'Changes Requested': 'bg-orange-100 text-orange-800'
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Propuestas Cliente</h1>
                    <p className="text-slate-500 text-sm">Gestiona y crea propuestas de viaje personalizadas.</p>
                </div>
                <button
                    onClick={createNewProposal}
                    disabled={creating}
                    className="flex items-center gap-2 px-4 py-2 bg-[#122045] text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
                >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Nueva Propuesta
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {proposals.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-slate-800 font-bold mb-2">No hay propuestas aún</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                                Crea tu primera propuesta para comenzar a gestionar itinerarios y cotizaciones.
                            </p>
                            <button
                                onClick={createNewProposal}
                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium text-sm transition-colors"
                            >
                                Crear Propuesta
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Título</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Versión</th>
                                    <th className="px-6 py-4">Última Modificación</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {proposals.map((proposal) => (
                                    <tr key={proposal.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 icon-link-hover group cursor-pointer" onClick={() => router.push(`/dashboard/admin/proposals/${proposal.id}/edit`)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="group-hover:text-blue-600 transition-colors">{proposal.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {proposal.client_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[proposal.status] || statusColors['Draft']}`}>
                                                {proposal.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            v{proposal.latest_version_number}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(proposal.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/admin/proposals/${proposal.id}/edit`); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {proposal.latest_version_number > 0 && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); window.open(`/proposals/${proposal.id}`, '_blank'); }}
                                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Ver Propuesta Pública"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
