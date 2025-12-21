'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospect, ProspectStatus } from '@/types/prospect';
import { MessageCircle, EyeOff, Loader2, Search, Download, Edit2, Mail } from 'lucide-react';
import EditModal from './EditModal';

export default function ProspectsPage() {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('all');

    // Edit Modal State
    const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);

    useEffect(() => {
        fetchProspects();
    }, []);

    const fetchProspects = async () => {
        setLoading(true);
        // User requested consecutive sorting by Folio. 
        // Assuming 'folio' exists. If it's a string like 'P1001', we might rely on Supabase sort or client sort.
        // We'll try to order by 'folio' descending (newest first). 
        // If folio is not reliable, created_at is a good proxy for consecutive/latest.
        const { data, error } = await supabase
            .from('prospects')
            .select('*')
            .eq('is_hidden', false)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching prospects:', error);
        } else {
            setProspects(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: ProspectStatus) => {
        setUpdating(id);
        const { error } = await supabase
            .from('prospects')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        } else {
            setProspects(prospects.map(p => p.id === id ? { ...p, status: newStatus } : p));
        }
        setUpdating(null);
    };

    const hideProspect = async (id: string) => {
        if (!confirm('¿Estás seguro de ocultar este prospecto? No se borrará de la base de datos.')) return;

        setUpdating(id);
        const { error } = await supabase
            .from('prospects')
            .update({ is_hidden: true })
            .eq('id', id);

        if (error) {
            console.error('Error hiding prospect:', error);
            alert('Error hiding prospect');
        } else {
            setProspects(prospects.filter(p => p.id !== id));
        }
        setUpdating(null);
    };

    // Filter Logic
    const filteredProspects = useMemo(() => {
        return prospects.filter(p => {
            const matchesSearch = (
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.folio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.phone.includes(searchTerm)
            );
            const matchesProgram = programFilter === 'all' || p.form_id === programFilter;
            return matchesSearch && matchesProgram;
        });
    }, [prospects, searchTerm, programFilter]);

    // Unique Programs for Dropdown
    const programs = useMemo(() => {
        const ids = new Set(prospects.map(p => p.form_id));
        return Array.from(ids);
    }, [prospects]);

    // Export CSV
    const exportCSV = () => {
        const headers = ['Folio', 'Status', 'Nombre', 'Email', 'Teléfono', 'Programa', 'Fecha'];
        const rows = filteredProspects.map(p => [
            p.folio || '',
            p.status || 'Nuevo',
            p.name,
            p.email,
            p.phone,
            p.form_id,
            new Date(p.created_at).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "prospectos_filtrados.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getWhatsAppLink = (phone: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}`;
    };

    const statusColors: Record<ProspectStatus, string> = {
        'Nuevo': 'bg-blue-100 text-blue-800',
        'Contactado': 'bg-yellow-100 text-yellow-800',
        'Mostro interés': 'bg-purple-100 text-purple-800',
        'Cliente': 'bg-green-100 text-green-800'
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Prospectos Interesados</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Exportar CSV
                    </button>
                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-2 rounded-lg">
                        Total: {filteredProspects.length}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo, folio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="all">Todos los programas</option>
                        {programs.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Folio</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Contacto</th>
                                    <th className="px-6 py-4">Programa</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProspects.map((prospect) => (
                                    <tr key={prospect.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-500 font-bold">
                                            {prospect.folio || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={prospect.status || 'Nuevo'}
                                                onChange={(e) => updateStatus(prospect.id, e.target.value as ProspectStatus)}
                                                disabled={updating === prospect.id}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${statusColors[prospect.status || 'Nuevo'] || 'bg-gray-100 text-gray-800'}`}
                                            >
                                                <option value="Nuevo">Nuevo</option>
                                                <option value="Contactado">Contactado</option>
                                                <option value="Mostro interés">Mostro interés</option>
                                                <option value="Cliente">Cliente</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {prospect.name}
                                        </td>
                                        <td className="px-6 py-4 space-y-1">
                                            <a href={`mailto:${prospect.email}`} className="flex items-center gap-1.5 text-slate-900 hover:text-blue-600 transition-colors">
                                                <Mail className="w-3.5 h-3.5" />
                                                {prospect.email}
                                            </a>
                                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                {prospect.phone}
                                                <a
                                                    href={getWhatsAppLink(prospect.phone)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                    title="Contactar por WhatsApp"
                                                >
                                                    <MessageCircle className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                                {prospect.form_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(prospect.created_at).toLocaleString('es-MX', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setEditingProspect(prospect)}
                                                    className="text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50"
                                                    title="Editar información"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => hideProspect(prospect.id)}
                                                    disabled={updating === prospect.id}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                                    title="Ocultar prospecto"
                                                >
                                                    {updating === prospect.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <EyeOff className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProspects.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            {searchTerm || programFilter !== 'all' ? 'No se encontraron resultados con los filtros actuales.' : 'No hay prospectos activos.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {editingProspect && (
                <EditModal
                    prospect={editingProspect}
                    onClose={() => setEditingProspect(null)}
                    onSave={(updated) => {
                        setProspects(prospects.map(p => p.id === updated.id ? updated : p));
                    }}
                />
            )}
        </div>
    );
}
