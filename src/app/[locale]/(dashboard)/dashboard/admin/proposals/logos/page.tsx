'use client';

import { supabase } from '@/lib/supabase';
import { ChevronLeft, Plus, Copy, Check, Loader2, Save, X, Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Logo {
    id: string;
    label: string;
    url: string;
}

export default function LogosPage() {
    const [logos, setLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // State for Add/Edit Modal
    const [isOpen, setIsOpen] = useState(false);
    const [editingLogo, setEditingLogo] = useState<Logo | null>(null); // If null, we are adding. If set, we are editing.
    const [formData, setFormData] = useState({ label: '', url: '' });
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        setLoading(true);
        const { data } = await supabase.from('logos').select('*').order('label');
        if (data) setLogos(data);
        setLoading(false);
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(url);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openAddModal = () => {
        setEditingLogo(null);
        setFormData({ label: '', url: '' });
        setIsOpen(true);
    };

    const openEditModal = (logo: Logo) => {
        setEditingLogo(logo);
        setFormData({ label: logo.label, url: logo.url });
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (!formData.label.trim() || !formData.url.trim()) return;
        setSaving(true);

        let error;
        if (editingLogo) {
            // Update
            const { error: err } = await supabase
                .from('logos')
                .update({ label: formData.label, url: formData.url })
                .eq('id', editingLogo.id);
            error = err;
        } else {
            // Insert
            const { error: err } = await supabase
                .from('logos')
                .insert({ label: formData.label, url: formData.url });
            error = err;
        }

        if (!error) {
            setIsOpen(false);
            fetchLogos();
        } else {
            alert('Error al guardar');
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este logo?')) return;
        setDeletingId(id);
        const { error } = await supabase.from('logos').delete().eq('id', id);
        if (!error) {
            fetchLogos();
        } else {
            alert('Error al eliminar');
        }
        setDeletingId(null);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/proposals" className="p-2 -ml-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Catálogo de Logotipos</h1>
                        <p className="text-slate-500 text-sm">Biblioteca centralizada de marcas y partners.</p>
                    </div>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-[#122045] text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Logo
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">{editingLogo ? 'Editar Logo' : 'Agregar Nuevo Logo'}</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    placeholder="Ej. Disney World"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">URL del Logo (SVG/PNG)</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    placeholder="https://..."
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                            {/* Preview in modal */}
                            {formData.url && (
                                <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center h-24">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={formData.url} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-medium">Cancelar</button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !formData.label || !formData.url}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                                {editingLogo ? 'Guardar Cambios' : 'Guardar Logo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {logos.map((logo) => (
                        <div key={logo.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center gap-4 hover:shadow-md transition-shadow group relative">
                            <div className="h-16 w-full flex items-center justify-center p-2 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={logo.url}
                                    alt={logo.label}
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="text-center w-full">
                                <h3 className="font-semibold text-slate-800 text-sm truncate" title={logo.label}>{logo.label}</h3>
                            </div>

                            {/* Actions Overlay */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleCopyUrl(logo.url)}
                                    className="p-1.5 bg-white hover:bg-slate-50 text-slate-500 rounded-md border border-slate-200 shadow-sm"
                                    title="Copiar URL"
                                >
                                    {copiedId === logo.url ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    onClick={() => openEditModal(logo)}
                                    className="p-1.5 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-md border border-slate-200 shadow-sm"
                                    title="Editar"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(logo.id)}
                                    className="p-1.5 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-md border border-slate-200 shadow-sm"
                                    title="Eliminar"
                                >
                                    {deletingId === logo.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <button
                        onClick={openAddModal}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/10 transition-colors bg-slate-50/50 h-full min-h-[160px]"
                    >
                        <Plus className="w-8 h-8 opacity-50" />
                        <span className="text-sm font-medium">Agregar Otro</span>
                    </button>
                </div>
            )}
        </div>
    );
}
