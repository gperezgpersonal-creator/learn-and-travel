'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Proposal, ProposalVersion, ProposalContent, cleanEmptyProposalContent } from '@/types/proposal';
import { Loader2, Save, Send, Eye, ChevronLeft, Layout, FileText, Plane, DollarSign, Scale, Info, ExternalLink, Plus, Trash2, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Helper components for form fields
const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon: any }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
        <Icon className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800">{children}</h2>
    </div>
);

const Input = ({ label, value, onChange, placeholder, type = 'text', helper }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-700 font-medium"
        />
        {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 4 }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{label}</label>
        <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-700"
        />
    </div>
);

// Helper for Logo Selection
const LogoSelector = ({ value, onChange }: any) => {
    const logos = [
        { id: 'tec', label: 'Tec de Monterrey', url: '/tec-monterrey-white.png' },
        { id: 'prepa', label: 'PrepaTec', url: '/images/prepatec-logo-white.png' },
        { id: 'lt', label: 'Learn & Travel', url: 'https://learnandtravel.com/logo.png' } // Placeholder
    ];

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Logotipo Principal</label>
            <div className="flex gap-4">
                {logos.map(logo => (
                    <button
                        key={logo.id}
                        onClick={() => onChange(logo.url)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 w-32 ${value === logo.url
                            ? 'border-indigo-400 bg-indigo-900/80 ring-2 ring-indigo-400' // Selected: Blue bg + highlight
                            : 'border-slate-800 hover:border-slate-600 bg-slate-900' // Unselected: Dark slate
                            }`}
                    >
                        <div className="h-12 flex items-center justify-center">
                            {/* In real app use Next Image, using img for simple external urls in demo */}
                            <img src={logo.url} alt={logo.label} className="max-h-full max-w-full object-contain" />
                        </div>
                        <span className={`text-xs font-medium ${value === logo.url ? 'text-indigo-700' : 'text-slate-500'}`}>
                            {logo.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Helper for Version History
const VersionHistory = ({ proposalId, currentVersion }: { proposalId: string, currentVersion: number }) => {
    const [versions, setVersions] = useState<any[]>([]);

    useEffect(() => {
        const fetchVersions = async () => {
            const { data } = await supabase
                .from('proposal_versions')
                .select('id, version_number, created_at, is_published')
                .eq('proposal_id', proposalId)
                .order('version_number', { ascending: false });
            if (data) setVersions(data);
        };
        fetchVersions();
    }, [proposalId, currentVersion]);

    return (
        <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-4">Historial de Versiones</h3>
            <div className="space-y-2">
                {versions.map(v => (
                    <div key={v.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-slate-50 group">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${v.is_published ? 'bg-green-500' : 'bg-slate-300'}`} />
                            <span className="font-medium text-slate-700">v{v.version_number}</span>
                            <span className="text-xs text-slate-500">{new Date(v.created_at).toLocaleDateString()}</span>
                        </div>
                        <a
                            href={`/proposals/${proposalId}?v=${v.id}`} // We would implement specific version view logic later, for now just link to public
                            target="_blank"
                            className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-800"
                        >
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                ))}
                {versions.length === 0 && <p className="text-xs text-slate-400 italic">Sin versiones guardadas</p>}
            </div>
        </div>
    );
};

// Helper for Partners List
const PartnersListEditor = ({ value, onChange }: { value: { name: string; image_url?: string }[]; onChange: (val: any[]) => void }) => {
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const addPartner = () => {
        if (!newName.trim()) return;
        onChange([...value, { name: newName, image_url: newUrl }]);
        setNewName('');
        setNewUrl('');
    };

    const removePartner = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Lista de Partners
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{value.length}</span>
            </h3>

            <div className="space-y-2">
                {value.map((partner, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                        <div className="w-8 h-8 bg-white rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                            {partner.image_url ? (
                                <img src={partner.image_url} alt={partner.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-slate-300">Img</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{partner.name}</p>
                            {partner.image_url && <p className="text-xs text-slate-400 truncate max-w-[200px]">{partner.image_url}</p>}
                        </div>
                        <button onClick={() => removePartner(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-200 border-dashed">
                <div className="flex-1 space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 font-bold">Nombre del Partner</label>
                    <input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Ej. NASA Kennedy Space Center"
                        className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 font-bold">Logo URL</label>
                    <input
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:border-indigo-500 outline-none"
                    />
                </div>
                <button
                    onClick={addPartner}
                    disabled={!newName.trim()}
                    className="px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Helper for Itinerary List
const ItineraryListEditor = ({ value, onChange }: { value: { day: string; activity: string }[]; onChange: (val: any[]) => void }) => {
    const [newDay, setNewDay] = useState('');
    const [newActivity, setNewActivity] = useState('');

    const addDay = () => {
        if (!newDay.trim() || !newActivity.trim()) return;
        onChange([...value, { day: newDay, activity: newActivity }]);
        setNewDay('');
        setNewActivity('');
    };

    const removeDay = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    return (
        <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Itinerario Día por Día
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{value.length}</span>
            </h3>

            <div className="space-y-2">
                {value.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                        <div className="min-w-[60px] pt-0.5">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                {item.day}
                            </span>
                        </div>
                        <p className="flex-1 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{item.activity}</p>
                        <button onClick={() => removeDay(idx)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[100px_1fr_auto] gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-200 border-dashed">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 font-bold">Día</label>
                    <input
                        value={newDay}
                        onChange={e => setNewDay(e.target.value)}
                        placeholder="Ej. Día 1"
                        className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 font-bold">Actividad / Descripción</label>
                    <textarea
                        value={newActivity}
                        onChange={e => setNewActivity(e.target.value)}
                        placeholder="Llegada y bienvenida..."
                        rows={1}
                        className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 focus:border-indigo-500 outline-none resize-none"
                    />
                </div>
                <button
                    onClick={addDay}
                    disabled={!newDay.trim() || !newActivity.trim()}
                    className="h-[34px] px-3 bg-slate-800 text-white rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Main Editor Page
export default function ProposalEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    // ... (rest of state logic same as before) ...
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [content, setContent] = useState<ProposalContent>(cleanEmptyProposalContent);
    const [versionId, setVersionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'intro' | 'details' | 'logistics' | 'financials' | 'legal'>('general');

    // ... (fetch and save logic same as before, omitted for brevity in search replacement but assumed present) ...
    // RE-IMPLEMENTING FULL COMPONENT LOGIC TO ENSURE INTEGRITY in replace_file_content

    useEffect(() => {
        fetchProposalData();
    }, [id]);

    const fetchProposalData = async () => {
        setLoading(true);
        const { data: propData, error: propError } = await supabase.from('proposals').select('*').eq('id', id).single();
        if (propError || !propData) { setLoading(false); return; }
        setProposal(propData);

        if (propData.latest_version_number > 0) {
            const { data: verData } = await supabase.from('proposal_versions').select('*').eq('proposal_id', id).order('version_number', { ascending: false }).limit(1).single();
            if (verData) {
                setContent(verData.content);
                if (!verData.is_published) setVersionId(verData.id);
            }
        }
        setLoading(false);
    };

    const handleSave = async (publish = false) => {
        if (!proposal) return;
        setSaving(true);
        try {
            let currentVersionId = versionId;
            let currentVersionNumber = proposal.latest_version_number;

            if (!currentVersionId) {
                currentVersionNumber += 1;
                const { data: newVer, error: newVerError } = await supabase.from('proposal_versions').insert({
                    proposal_id: proposal.id, version_number: currentVersionNumber, content: content, is_published: publish
                }).select().single();
                if (newVerError) throw newVerError;
                currentVersionId = newVer.id;

                await supabase.from('proposals').update({ latest_version_number: currentVersionNumber, title: content.general.program_title || proposal.title, status: publish ? 'Sent' : 'Draft' }).eq('id', proposal.id);
                if (!publish) setVersionId(newVer.id);
                setProposal({ ...proposal, latest_version_number: currentVersionNumber, title: content.general.program_title || proposal.title });
            } else {
                await supabase.from('proposal_versions').update({ content: content, is_published: publish, created_at: new Date().toISOString() }).eq('id', currentVersionId);
                await supabase.from('proposals').update({ title: content.general.program_title || proposal.title, status: publish ? 'Sent' : 'Draft' }).eq('id', proposal.id);
            }
            if (publish) { setVersionId(null); alert('¡Versión publicada y "Enviada" correctamente!'); }
        } catch (err) { console.error(err); alert('Error al guardar.'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

    const tabs = [
        { id: 'general', label: 'General', icon: Info },
        { id: 'intro', label: 'Intro', icon: Layout },
        { id: 'details', label: 'Detalles', icon: FileText },
        { id: 'logistics', label: 'Logística', icon: Plane },
        { id: 'financials', label: 'Inversión', icon: DollarSign },
        { id: 'legal', label: 'Legal', icon: Scale },
    ];

    return (
        <div className="pb-20">
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/proposals" className="p-2 -ml-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 line-clamp-1">{content.general.program_title || 'Nueva Propuesta'}</h1>
                        <p className="text-xs font-mono text-slate-500">v{proposal?.latest_version_number}{versionId ? ' (Draft)' : ' (Published)'} • {proposal?.client_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleSave(false)} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar Borrador
                    </button>
                    <button onClick={() => handleSave(true)} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm shadow-indigo-200">
                        <Send className="w-4 h-4" /> Publicar
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto mt-8 px-6 grid grid-cols-12 gap-8">
                <aside className="col-span-3">
                    <nav className="space-y-1 sticky top-32">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[#122045] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} /> {tab.label}
                                </button>
                            );
                        })}
                        {proposal && <VersionHistory proposalId={proposal.id} currentVersion={proposal.latest_version_number} />}
                    </nav>
                </aside>

                <main className="col-span-9 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[600px]">
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionTitle icon={Info}>Información General</SectionTitle>
                            <LogoSelector value={content.general.logo_url} onChange={(v: string) => setContent({ ...content, general: { ...content.general, logo_url: v } })} />
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <Input label="Nombre del Cliente / Profesor" placeholder="Ej. Juan Pérez" value={content.general.professor_name} onChange={(v: string) => setContent({ ...content, general: { ...content.general, professor_name: v } })} />
                                <Input label="Ciudad Destino" placeholder="Ej. Orlando, FL" value={content.general.city} onChange={(v: string) => setContent({ ...content, general: { ...content.general, city: v } })} />
                                {/* Cover URL removed */}
                                <div className="col-span-2">
                                    <Input label="Título del Programa" placeholder="Ej. Business & Innovation Week 2026" value={content.general.program_title} onChange={(v: string) => setContent({ ...content, general: { ...content.general, program_title: v } })} />
                                </div>
                                <Input label="Fechas del Programa" placeholder="Ej. 10 - 15 Mayo 2026" value={content.general.dates} onChange={(v: string) => setContent({ ...content, general: { ...content.general, dates: v } })} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'intro' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionTitle icon={Layout}>Introducción</SectionTitle>
                            <Input label="Título Sección" value={content.intro.title} onChange={(v: string) => setContent({ ...content, intro: { ...content.intro, title: v } })} />
                            <TextArea label="Texto Introductorio" value={content.intro.text} onChange={(v: string) => setContent({ ...content, intro: { ...content.intro, text: v } })} placeholder="Bienvenidos a esta experiencia..." rows={6} />
                            <TextArea label="Objetivo del Programa" value={content.intro.objective} onChange={(v: string) => setContent({ ...content, intro: { ...content.intro, objective: v } })} placeholder="El objetivo principal es..." />
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionTitle icon={FileText}>Contenido y Detalles</SectionTitle>
                            <Input label="Título Sección" value={content.details.title} onChange={(v: string) => setContent({ ...content, details: { ...content.details, title: v } })} />
                            <Input label="Título Sección" value={content.details.title} onChange={(v: string) => setContent({ ...content, details: { ...content.details, title: v } })} />
                            {/* Partner Banner removed as requested */}
                            <TextArea label="Aprendizajes Esperados" value={content.details.learning_outcomes} onChange={(v: string) => setContent({ ...content, details: { ...content.details, learning_outcomes: v } })} rows={4} />
                            <TextArea label="Contenido Académico" value={content.details.content_text} onChange={(v: string) => setContent({ ...content, details: { ...content.details, content_text: v } })} rows={6} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <PartnersListEditor value={content.details.partners} onChange={(v: any[]) => setContent({ ...content, details: { ...content.details, partners: v } })} />
                                <ItineraryListEditor value={content.details.itinerary} onChange={(v: any[]) => setContent({ ...content, details: { ...content.details, itinerary: v } })} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'logistics' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionTitle icon={Plane}>Logística</SectionTitle>
                            <TextArea label="Qué Incluye" value={content.logistics.inclusions} onChange={(v: string) => setContent({ ...content, logistics: { ...content.logistics, inclusions: v } })} rows={6} />
                            <div className="grid grid-cols-2 gap-6">
                                <TextArea label="Hotel / Alojamiento" placeholder="Nombre, estrellas y ubicación..." value={content.logistics.hotel} onChange={(v: string) => setContent({ ...content, logistics: { ...content.logistics, hotel: v } })} rows={4} />
                                <TextArea label="Vuelo / Transporte" placeholder="Aerolínea, horarios estimados..." value={content.logistics.flights} onChange={(v: string) => setContent({ ...content, logistics: { ...content.logistics, flights: v } })} rows={4} />
                            </div>
                            <TextArea label="Transporte Local" value={content.logistics.transport} onChange={(v: string) => setContent({ ...content, logistics: { ...content.logistics, transport: v } })} placeholder="Autobus privado de lujo..." />
                        </div>
                    )}

                    {activeTab === 'financials' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionTitle icon={DollarSign}>Inversión</SectionTitle>
                            <Input label="Precio Base (por persona)" value={content.financials.investment_base} onChange={(v: string) => setContent({ ...content, financials: { ...content.financials, investment_base: v } })} placeholder="$1,500 USD + IVA" />
                            <TextArea label="Notas de Pago / Condiciones" value={content.financials.notes} onChange={(v: string) => setContent({ ...content, financials: { ...content.financials, notes: v } })} rows={4} />
                        </div>
                    )}

                    {activeTab === 'legal' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionTitle icon={Scale}>Notas Legales</SectionTitle>
                            <TextArea label="Disclaimer" value={content.legal.disclaimer} onChange={(v: string) => setContent({ ...content, legal: { ...content.legal, disclaimer: v } })} rows={4} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
