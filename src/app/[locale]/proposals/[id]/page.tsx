import { supabase } from '@/lib/supabase';
import { ProposalContent } from '@/types/proposal';
import ProposalFloatingActions from '@/components/ProposalFloatingActions';
import ProposalPrintStyles from '@/components/ProposalPrintStyles';
import { MapPin, Calendar, User, Plane, Hotel, Quote } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Ensure dynamic rendering



async function getProposal(id: string) {
    // 1. Get Proposal Info
    const { data: proposal, error: propError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();

    if (propError || !proposal) return null;

    // 2. Get Latest PUBLISHED Version
    // We order by version_number desc and take the first one that is published
    const { data: version, error: verError } = await supabase
        .from('proposal_versions')
        .select('version_number, content, created_at')
        .eq('proposal_id', id)
        .eq('is_published', true)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

    if (verError || !version) return null; // No published version found

    return {
        proposal,
        content: version.content as ProposalContent,
        versionNumber: version.version_number,
        publishDate: version.created_at,
        isApproved: proposal.status === 'Approved',
        approverName: proposal.approver_name,
        approvedAt: proposal.approved_at
    };
}

export default async function ProposalViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getProposal(id);

    if (!data) {
        return notFound();
    }

    const { content, versionNumber, publishDate, isApproved, approverName, approvedAt } = data;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <ProposalPrintStyles />
            <ProposalFloatingActions
                proposalId={id}
                isApproved={isApproved}
                approverName={approverName}
            />
            {/* Hero Section */}
            <header className="relative min-h-[70vh] flex flex-col font-sans">
                {/* Background (Fixed Corporate Blue) */}
                <div className="absolute inset-0 bg-slate-900 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                        alt="Corporate Background"
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 opacity-90" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 flex-1 flex items-center justify-center py-20 px-6">
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        {/* a) PrepaTEC Logo (White) */}
                        {content.general.logo_url && (
                            <div className="flex justify-center mb-4 animate-in slide-in-from-top-4 duration-700">
                                <img src={content.general.logo_url} alt="School Logo" className="h-28 md:h-36 object-contain drop-shadow-2xl" />
                            </div>
                        )}

                        {/* b) Info Line: Exclusive Proposal | Version | Date */}
                        <div className="flex items-center justify-center gap-3 text-sm md:text-base font-medium text-blue-100/80 tracking-widest uppercase animate-in slide-in-from-bottom-2 duration-700 delay-100">
                            <span>Propuesta Exclusiva</span>
                            <span className="w-1 h-1 bg-blue-400 rounded-full" />
                            <span>v{versionNumber}</span>
                            <span className="w-1 h-1 bg-blue-400 rounded-full" />
                            <span>{new Date(publishDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        {/* c) Program Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl animate-in slide-in-from-bottom-6 duration-700 delay-200 leading-tight">
                            {content.general.program_title}
                        </h1>

                        {/* d) Details: Professor, City (Large), Dates (Largest) */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 pt-8 text-white animate-in slide-in-from-bottom-8 duration-700 delay-300">
                            {/* Professor */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-indigo-300 text-xs uppercase tracking-widest font-semibold">Dirigido a</span>
                                <span className="font-medium text-lg text-indigo-100">{content.general.professor_name || data.proposal.client_name}</span>
                            </div>

                            {/* City - Larger */}
                            <div className="flex flex-col items-center gap-2">
                                <MapPin className="w-8 h-8 text-indigo-400" />
                                <span className="font-bold text-2xl tracking-wide">{content.general.city}</span>
                            </div>

                            {/* Dates - Largest */}
                            <div className="flex flex-col items-center gap-2">
                                <Calendar className="w-8 h-8 text-indigo-400" />
                                <span className="font-bold text-3xl text-indigo-50 border-b-2 border-indigo-500/50 pb-1">{content.general.dates}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quote Disclaimer */}
                    <div className="absolute bottom-2 left-0 right-0 text-center pb-4 px-6 opacity-60 hover:opacity-100 transition-opacity">
                        <p className="text-[10px] md:text-xs text-white/70 max-w-2xl mx-auto">
                            * Esta cotización podría sufrir variaciones hasta que no se cumpla el mínimo necesario para el viaje, en caso necesario se recotizará nuevamente.
                        </p>
                    </div>
                </div>

                {/* White Strip with L&T Logo - Now Relative at Bottom */}
                {/* White Strip with Centered Color Logo */}
                <div className="relative z-20 bg-white shadow-xl py-6 border-t border-slate-100">
                    <div className="max-w-4xl mx-auto px-6 flex items-center justify-center">
                        <img src="/logo.png" alt="Learn and Travel" className="h-14 md:h-16 object-contain" />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 relative z-30 space-y-16">

                {/* Intro Card */}
                {content.intro.visible && (
                    <section className="bg-white rounded-xl shadow-xl p-8 md:p-12 animate-in slide-in-from-bottom-12 duration-700 delay-500">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <h2 className="text-3xl font-bold text-slate-800">{content.intro.title}</h2>
                            <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" />
                            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {content.intro.text}
                            </p>
                            {content.intro.objective && (
                                <div className="bg-indigo-50 p-6 rounded-lg text-indigo-900 italic relative mt-8">
                                    <Quote className="w-8 h-8 text-indigo-200 absolute -top-4 -left-2" />
                                    <p className="font-medium">"{content.intro.objective}"</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Details Section */}
                {content.details.visible && (
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">{content.details.title}</h2>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Banner removed */}

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                    Contenido Académico
                                </h3>
                                <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                                    {content.details.content_text || 'Detalles por definir.'}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                    Aprendizajes Esperados
                                </h3>
                                <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                                    {content.details.learning_outcomes || 'No especificado.'}
                                </p>
                            </div>
                        </div>

                        {content.details.partners && content.details.partners.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Nuestros Aliados</h3>
                                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 grayscale hover:grayscale-0 transition-all duration-500">
                                    {content.details.partners.map((partner, idx) => (
                                        <div key={idx} className="w-32 h-20 relative flex items-center justify-center group">
                                            {partner.image_url ? (
                                                <img
                                                    src={partner.image_url}
                                                    alt={partner.name}
                                                    className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-slate-400">{partner.name}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {content.details.itinerary && content.details.itinerary.length > 0 && (
                            <div className="mt-12 bg-slate-50 rounded-2xl p-8 border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                    Itinerario
                                </h3>
                                <div className="space-y-0">
                                    {content.details.itinerary.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 md:gap-8 relative pb-8 last:pb-0">
                                            {idx !== content.details.itinerary.length - 1 && (
                                                <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-indigo-100" />
                                            )}
                                            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full border-2 border-indigo-100 flex items-center justify-center z-10 shadow-sm text-xs font-bold text-indigo-700">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h4 className="font-bold text-slate-800 mb-1 leading-none">{item.day}</h4>
                                                <p className="text-slate-600 text-sm leading-relaxed">{item.activity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Logistics Section */}
                {content.logistics.visible && (
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">{content.logistics.title}</h2>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                    <Hotel className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Hospedaje</h4>
                                    <p className="text-sm text-slate-500 mt-1">{content.logistics.hotel || 'Por confirmar'}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                    <Plane className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Vuelos / Transporte</h4>
                                    <p className="text-sm text-slate-500 mt-1">{content.logistics.flights || 'No incluidos'}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Transporte Local</h4>
                                    <p className="text-sm text-slate-500 mt-1">{content.logistics.transport || 'Incluido'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 rounded-xl shadow-2xl border border-indigo-500/20">
                            <h3 className="text-2xl font-bold mb-4 text-white">¿Qué incluye?</h3>
                            <p className="text-indigo-50 whitespace-pre-wrap leading-relaxed opacity-90">
                                {content.logistics.inclusions}
                            </p>
                        </div>
                    </section>
                )}

                {/* Investment Section */}
                {content.financials.visible && (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 text-center space-y-8 text-white">
                        <h2 className="text-3xl font-bold">{content.financials.title}</h2>
                        <div className="space-y-2">
                            <p className="text-slate-400 uppercase tracking-widest text-sm font-semibold">Inversión por Persona</p>
                            <div className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                                {content.financials.investment_base}
                            </div>
                        </div>
                        {content.financials.notes && (
                            <div className="bg-slate-800/50 p-6 rounded-xl text-sm text-slate-300 max-w-2xl mx-auto">
                                <p className="font-semibold mb-2">Condiciones y Notas:</p>
                                <p className="whitespace-pre-wrap">{content.financials.notes}</p>
                            </div>
                        )}

                    </section>
                )}

                {/* Disclaimer */}
                <footer className="text-center text-xs text-slate-400 pt-8 pb-4 border-t border-slate-200">
                    <p className="mb-2">{content.legal.disclaimer}</p>
                    <p>© {new Date().getFullYear()} Learn and Travel. Todos los derechos reservados.</p>
                </footer>
            </main>


        </div >
    );
}
