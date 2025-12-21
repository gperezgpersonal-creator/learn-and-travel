'use client';

import { useState } from 'react';
import { Download, Check, X, Loader2, FileCheck } from 'lucide-react';
import { approveProposal } from '@/app/actions/approveProposal';
import { useRouter } from 'next/navigation';

interface ProposalFloatingActionsProps {
    proposalId: string;
    isApproved: boolean;
    approverName?: string | null;
}

export default function ProposalFloatingActions({ proposalId, isApproved, approverName }: ProposalFloatingActionsProps) {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', terms: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleApprove = async () => {
        if (!formData.terms) {
            setError('Debes aceptar los términos y condiciones.');
            return;
        }
        if (!formData.name || !formData.email) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        setLoading(true);
        setError('');

        const res = await approveProposal(proposalId, { name: formData.name, email: formData.email });

        if (res.success) {
            setShowModal(false);
            router.refresh();
        } else {
            setError(res.error || 'Error al aprobar la propuesta.');
        }
        setLoading(false);
    };

    if (isApproved) {
        return (
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-500 no-print">
                <div className="bg-emerald-50 text-emerald-800 px-6 py-3 rounded-full shadow-lg border border-emerald-100 flex items-center gap-3 font-medium">
                    <FileCheck className="w-5 h-5" />
                    <div className="flex flex-col text-xs md:text-sm">
                        <span className="font-bold">Propuesta Aprobada</span>
                        {approverName && <span className="opacity-80">por {approverName}</span>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 no-print">
                {/* Approve Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all font-semibold shadow-indigo-500/30"
                >
                    <Check className="w-5 h-5" />
                    Aprobar Propuesta
                </button>

                {/* Download Button */}
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-all font-semibold"
                >
                    <Download className="w-5 h-5" />
                    <span>Descargar PDF</span>
                </button>
            </div>

            {/* Approval Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-800">Aprobar Propuesta</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Disclaimer Box */}
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
                                <p className="mb-2 font-semibold">⚠️ Información Importante:</p>
                                <p className="mb-2">
                                    Este documento solo es para fines informativos internos. No utilizar para promover el programa. Mínimo 15 personas.
                                </p>
                                <p>
                                    Una vez autorizado el programa, Learn and Travel desarrollará los materiales necesarios para la promoción correcta: presentación, página web, video promocional, flyers, formularios, etc.
                                </p>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ej. Juan Pérez"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="juan@institucion.mx"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                {/* Terms Checkbox */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={formData.terms}
                                        onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                        He leído y acepto los términos y condiciones específicos de esta propuesta. Entiendo que esta cotización podría sufrir variaciones.
                                    </span>
                                </label>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in slide-in-from-top-1">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Confirmar Aprobación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
