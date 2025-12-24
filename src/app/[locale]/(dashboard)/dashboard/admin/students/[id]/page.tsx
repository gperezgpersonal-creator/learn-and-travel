'use client';

import { useEffect, useState, use } from 'react';
import { FinanceService, Student, LedgerEntry } from '@/services/supabase/financeService';
import { StudentService } from '@/services/supabase/studentService';
import { Loader2, ArrowLeft, Plus, DollarSign, Calendar, CreditCard, Mail, Phone, Calendar as CalendarIcon, Link as LinkIcon, Copy, FileText, CheckCircle, AlertCircle, Download, Eye, MapPin } from 'lucide-react';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';
import LedgerTable from '../../finance/collections/components/LedgerTable';

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [student, setStudent] = useState<Student | null>(null);
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Manual Charge/Payment State
    const [showChargeForm, setShowChargeForm] = useState(false);
    const [transactionType, setTransactionType] = useState<'charge' | 'payment'>('charge');
    const [chargeAmount, setChargeAmount] = useState('');
    const [chargeConcept, setChargeConcept] = useState('');
    const [activeTab, setActiveTab] = useState<'financial' | 'profile'>('profile'); // Default to profile

    // New fields for payment
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    const [submitting, setSubmitting] = useState(false);
    const [magicLink, setMagicLink] = useState<string | null>(null);
    const [generatingLink, setGeneratingLink] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [studentData, ledgerData, docsData] = await Promise.all([
                FinanceService.getStudentById(id),
                FinanceService.getStudentLedger(id),
                StudentService.getDocuments(id)
            ]);
            setStudent(studentData);
            setLedger(ledgerData);
            setDocuments(docsData);
        } catch (error) {
            console.error('Failed to load student data', error);
        } finally {
            setLoading(false);
        }
    };

    const openTransactionModal = (type: 'charge' | 'payment') => {
        setTransactionType(type);
        setChargeConcept('');
        setChargeAmount('');
        setPaymentMethod('cash');
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setShowChargeForm(true);
    };

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chargeAmount || !chargeConcept) return;

        setSubmitting(true);
        try {
            if (transactionType === 'charge') {
                await FinanceService.addCharge(id, parseFloat(chargeAmount), chargeConcept);
            } else {
                await FinanceService.addPayment(
                    id,
                    parseFloat(chargeAmount),
                    chargeConcept,
                    { method: 'manual', entered_by: 'admin' },
                    paymentMethod,
                    new Date(paymentDate).toISOString()
                );
            }

            await loadData();
            setShowChargeForm(false);
            setChargeAmount('');
            setChargeConcept('');
        } catch (error) {
            console.error('Failed to process transaction', error);
            alert('Failed to process transaction.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGenerateLink = async () => {
        setGeneratingLink(true);
        try {
            const token = await StudentService.generateMagicLink(id);
            // Construct full URL
            const url = `${window.location.origin}/es/student-onboarding/${token}`;
            setMagicLink(url);
        } catch (error) {
            console.error('Error generating link', error);
            alert('Error generating link');
        } finally {
            setGeneratingLink(false);
        }
    };

    const handlePreviewDoc = async (filePath: string) => {
        try {
            const url = await StudentService.getDocumentUrl(filePath);
            if (url) {
                window.open(url, '_blank');
            } else {
                alert('No se pudo generar el enlace de previsualización.');
            }
        } catch (e) {
            alert('Error al abrir el documento.');
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

    if (!student) return <div className="p-8 text-center">Student not found</div>;

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard/admin/students" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        {/* Header Reordered: ID | Name | Matrícula | Mail | Phone */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold" title="ID Interno">{student.human_id}</span>
                            <h1 className="text-2xl font-serif font-bold text-slate-900">{student.first_name} {student.last_name}</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mt-1">
                            {student.educational_id ? (
                                <span className="flex items-center gap-1 font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                                    {student.educational_id}
                                </span>
                            ) : (
                                <span className="text-slate-400 italic text-xs">Sin Matrícula</span>
                            )}
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {student.email}</span>
                            {student.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {student.phone}</span>}
                            {student.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {student.address}</span>}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Expediente
                    </button>
                    <button
                        onClick={() => setActiveTab('financial')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'financial' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Finanzas y Pagos
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">

                            {/* Documentación Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="font-bold text-slate-900">Documentación</h3>
                                </div>
                                <div className="p-0">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3">Documento</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">No. Documento</th>
                                                <th className="px-6 py-3">Vigencia</th>
                                                <th className="px-6 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[
                                                { id: 'passport', label: 'Pasaporte' },
                                                { id: 'visa_usa', label: 'Visa Americana' },
                                                { id: 'medical_proof', label: 'Seguro Médico' },
                                                { id: 'service_contract', label: 'Contrato' },
                                                { id: 'code_of_conduct', label: 'Reglamento' },
                                            ].map((docType) => {
                                                const doc = documents.find(d => d.document_type === docType.id);
                                                return (
                                                    <tr key={docType.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-slate-900">
                                                            {docType.label}
                                                            {!doc && <span className="ml-2 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Pendiente</span>}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {doc ? (
                                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                                                                    <CheckCircle className="w-3 h-3" /> Subido
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 text-xs">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 font-mono text-slate-600">
                                                            {doc?.document_number || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">
                                                            {doc?.expiration_date ? new Date(doc.expiration_date).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {doc && (
                                                                <button
                                                                    onClick={() => handlePreviewDoc(doc.file_path)}
                                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                                    title="Ver documento"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Medical Profile */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="font-bold text-slate-900">Ficha Médica</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Removed Blood Type */}
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Alergias</p>
                                        <div className="p-3 bg-slate-50 rounded text-sm text-slate-700 whitespace-pre-wrap">
                                            {/* Show whatever is in the arrays as text or conditions if arrays empty */}
                                            {[
                                                ...(student.medical_profile?.allergies?.food || []),
                                                ...(student.medical_profile?.allergies?.medications || []),
                                                ...(student.medical_profile?.allergies?.environmental || [])
                                            ].length > 0
                                                ? [
                                                    ...(student.medical_profile?.allergies?.food || []),
                                                    ...(student.medical_profile?.allergies?.medications || []),
                                                    ...(student.medical_profile?.allergies?.environmental || [])
                                                ].join(', ')
                                                : 'Ninguna registrada'}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Padecimientos / Condiciones</p>
                                        <div className="p-3 bg-slate-50 rounded text-sm text-slate-700 whitespace-pre-wrap">
                                            {student.medical_profile?.conditions || 'Ninguno'}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Medicamentos Recetados</p>
                                        <div className="p-3 bg-slate-50 rounded text-sm text-slate-700 whitespace-pre-wrap">
                                            {student.medical_profile?.medications || 'Ninguno'}
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="md:col-span-2 border-t border-slate-100 pt-4">
                                        <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-500" /> Contacto de Emergencia
                                        </p>
                                        {student.medical_profile?.emergency_contact ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-red-50 p-4 rounded-lg border border-red-100">
                                                <div>
                                                    <span className="text-xs font-semibold text-red-700 uppercase tracking-wider block mb-1">Nombre</span>
                                                    <span className="text-sm font-medium text-slate-900">{student.medical_profile.emergency_contact.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-red-700 uppercase tracking-wider block mb-1">Parentesco</span>
                                                    <span className="text-sm font-medium text-slate-900">{student.medical_profile.emergency_contact.relationship}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-red-700 uppercase tracking-wider block mb-1">Teléfono</span>
                                                    <span className="text-sm font-medium text-slate-900">{student.medical_profile.emergency_contact.phone}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-red-700 uppercase tracking-wider block mb-1">Email</span>
                                                    <span className="text-sm font-medium text-slate-900 text-ellipsis overflow-hidden">{student.medical_profile.emergency_contact.email}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-slate-500 italic text-sm">No registrado</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Profile */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="font-bold text-slate-900">Datos Logísticos</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Removed Tshirt Size */}
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Restricciones Alimenticias</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(student.logistics_profile?.dietary_restrictions || []).map((d, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-100 font-medium">{d}</span>
                                            ))}
                                            {!(student.logistics_profile?.dietary_restrictions || []).length && <span className="text-slate-500 italic text-sm">Sin restricciones</span>}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Necesidades Especiales</p>
                                        <div className="p-3 bg-slate-50 rounded text-sm text-slate-700 whitespace-pre-wrap">
                                            {student.logistics_profile?.special_needs || 'Ninguna'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Magic Link Generator */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" /> Acceso de Alumno
                                </h3>
                                <button
                                    onClick={handleGenerateLink}
                                    disabled={generatingLink}
                                    className="w-full py-2 px-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {generatingLink ? 'Generando...' : 'Generar Link Seguro'}
                                </button>
                                {magicLink && (
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="text-xs text-slate-500 mb-1">Copia y envía este link:</div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                readOnly
                                                value={magicLink}
                                                className="text-xs font-mono bg-white border border-slate-200 rounded px-2 py-1 flex-1 w-full"
                                                onClick={(e) => e.currentTarget.select()}
                                            />
                                            <button
                                                onClick={() => navigator.clipboard.writeText(magicLink)}
                                                className="p-1.5 hover:bg-slate-200 rounded text-slate-500"
                                                title="Copiar"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <a
                                            href={magicLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center mt-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <LinkIcon className="w-3 h-3" /> Abrir Link
                                        </a>
                                        <div className="text-[10px] text-amber-600 mt-1">Vence en 7 días</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'financial' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Financial Summary */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Enrolled Programs Mockup */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Programas Inscritos</h3>
                                <div className="text-sm text-slate-500 italic">
                                    No programs found (Enrollment syncing pending).
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 uppercase">Current Balance</p>
                                    <p className={`text-4xl font-bold mt-2 ${(student.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ${(student.balance || 0).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {(student.balance || 0) > 0 ? 'Outstanding Debt' : 'Fully Paid / Credit'}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-sm text-slate-600">Total Charged: <span className="font-semibold">${(student.total_charges || 0).toLocaleString()}</span></p>
                                    <p className="text-sm text-slate-600">Total Paid: <span className="font-semibold text-green-600">${(student.total_payments || 0).toLocaleString()}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => openTransactionModal('charge')}
                                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl p-4 shadow-sm flex items-center justify-center gap-3 transition-colors flex-1"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-red-700" />
                                </div>
                                <span className="font-semibold">Add Charge (Deuda)</span>
                            </button>

                            <button
                                onClick={() => openTransactionModal('payment')}
                                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl p-4 shadow-sm flex items-center justify-center gap-3 transition-colors flex-1"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4 text-green-700" />
                                </div>
                                <span className="font-semibold">Register Payment (Abono)</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'financial' && (
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Financial Ledger</h3>
                        <LedgerTable
                            entries={ledger}
                            onReverse={async (entry) => {
                                await FinanceService.unreconcilePayment(entry.id);
                                await loadData();
                            }}
                        />
                    </div>
                )}

            </FadeIn>

            {/* Manual Charge/Payment Form Modal */}
            {
                showChargeForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {transactionType === 'charge' ? 'Add Manual Charge' : 'Register Manual Payment'}
                                </h2>
                                <button onClick={() => setShowChargeForm(false)} className="text-slate-400 hover:text-slate-600">×</button>
                            </div>

                            <form onSubmit={handleTransactionSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Concept</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder={transactionType === 'charge' ? "e.g. Late Fee, Uniform..." : "e.g. Mensualidad 1..."}
                                        className="w-full p-2 border border-slate-300 rounded-lg"
                                        value={chargeConcept}
                                        onChange={e => setChargeConcept(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
                                            value={chargeAmount}
                                            onChange={e => setChargeAmount(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {transactionType === 'payment' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
                                            <select
                                                className="w-full p-2 border border-slate-300 rounded-lg"
                                                value={paymentMethod}
                                                onChange={e => setPaymentMethod(e.target.value)}
                                            >
                                                <option value="cash">Efectivo (Cash)</option>
                                                <option value="transfer">Transferencia</option>
                                                <option value="check">Cheque</option>
                                                <option value="other">Otro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                            <input
                                                type="date"
                                                className="w-full p-2 border border-slate-300 rounded-lg"
                                                value={paymentDate}
                                                onChange={e => setPaymentDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowChargeForm(false)}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${transactionType === 'charge' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        {submitting ? 'Processing...' : (transactionType === 'charge' ? 'Add Charge' : 'Register Payment')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
