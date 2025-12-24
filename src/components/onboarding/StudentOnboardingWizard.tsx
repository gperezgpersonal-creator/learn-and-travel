'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentService } from '@/services/supabase/studentService';
import { supabase } from '@/lib/supabase';
import { MedicalProfile, LogisticsProfile, StudentDocument, DocumentType } from '@/types/student';
import { Loader2, CheckCircle, Upload, AlertCircle, FileText, X, Info } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

type Step = 'validating' | 'personal' | 'medical' | 'logistics' | 'documents' | 'complete';

export default function StudentOnboardingWizard({ token }: { token: string }) {
    const [step, setStep] = useState<Step>('validating');
    const [studentId, setStudentId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const getErrorMessage = (e: any) => {
        if (e instanceof Error) return e.message;
        if (typeof e === 'string') return e;
        if (e?.message) return e.message;
        if (e?.error_description) return e.error_description;
        return JSON.stringify(e);
    };

    // Form Data
    const [personal, setPersonal] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        birth_date: '',
        address: '', // New field
        educational_id: '' // For display
    });

    const [medical, setMedical] = useState<MedicalProfile>({
        // Removed blood_type
        allergies: { food: [], medications: [], environmental: [] }, // We will use a simple text field for UI but map to structure if needed, or better yet, simplify structure. 
        // User requested "Deja Alergias pero en vez de limitarlo a algunos dejarlo abierto". 
        // I will map text input to a generic 'other' or just use the structure with free text.
        // Actually, let's keep the arrays but populate from text for simplicity in backend stability, or just rely on 'conditions' field if 'allergies' is too rigid.
        // Let's use a simpler text state for UI and save it into the arrays or a note. 
        // Wait, the interface says "Deja Alergias pero en vez de limitarlo a algunos dejarlo abierto".
        // I'll add a free text field for allergies and save it to `allergies.other` or similar if the type allows, or reuse `conditions`?
        // Let's modify the MedicalProfile type in my mind: we have `allergies: { food: [], ... }`.
        // I'll reuse the `conditions` or add a new field if possible, but strictly following the request: "Deja Alergias (...) dejarlo abierto".
        // I'll just use a text area for "Alergias" and save it into `allergies.medications` as a single string or `conditions`.
        // Better: let's stick to the current type but maybe just use one array or put it all in 'environmental' if it's open text.
        // Actually, I'll just put it in `conditions` prefaced with "Alergias: " if I can't change the type easily, OR, just use the `medications` array for text.
        // Let's look at `MedicalProfile` type again. It has arrays.
        // I will add a local state for 'allergiesText' and save it.

        conditions: '',
        medications: '',
        insurance: { carrier: '', policy_number: '', emergency_phone: '' }, // We'll only use emergency_phone, others are deprecated in UI but kept in type
        emergency_contact: { name: '', relationship: '', phone: '', email: '' } // New structure we'll save into `medical_profile` (flexible jsonb)
    });

    // Local state for allergies text to avoid complex array UI
    const [allergiesText, setAllergiesText] = useState('');

    const [logistics, setLogistics] = useState<LogisticsProfile>({
        // Removed tshirt_size
        dietary_restrictions: [],
        special_needs: ''
    });

    const [uploadedDocs, setUploadedDocs] = useState<StudentDocument[]>([]);

    // Document Metadata State
    const [docMetadata, setDocMetadata] = useState<{ [key in DocumentType]?: { number: string; expiry: string } }>({});

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            const result = await StudentService.validateMagicLink(token);
            if (result.isValid && result.studentId) {
                setStudentId(result.studentId);
                loadStudentData(result.studentId);
                loadDocs(result.studentId);
                setStep('personal');
            } else {
                setError('El enlace es inválido o ha expirado.');
            }
        } catch (err) {
            setError('Error validando el enlace.');
        }
    };

    const loadDocs = async (id: string) => {
        try {
            const docs = await StudentService.getDocuments(id);
            setUploadedDocs(docs);
        } catch (e) {
            console.error('Error loading docs', e);
        }
    };

    const loadStudentData = async (id: string) => {
        try {
            const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
            if (data) {
                setPersonal({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    phone: data.phone || '',
                    birth_date: data.logistics_profile?.birth_date || '',
                    address: data.address || '',
                    educational_id: data.educational_id || ''
                });
                if (data.medical_profile) {
                    const mp = data.medical_profile;
                    setMedical(prev => ({
                        ...prev,
                        ...mp,
                        // Ensure emergency_contact exists
                        emergency_contact: mp.emergency_contact || { name: '', relationship: '', phone: '', email: '' }
                    }));
                    // Load allergies text if existing (rudimentary check)
                    if (mp.allergies?.environmental?.length) setAllergiesText(mp.allergies.environmental.join(', '));
                    else if (mp.allergies?.food?.length) setAllergiesText(mp.allergies.food.join(', '));
                }
                if (data.logistics_profile) setLogistics(prev => ({ ...prev, ...data.logistics_profile }));
            }
        } catch (e) {
            console.error('Error loading student', e);
        }
    };

    const handlePersonalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await StudentService.updateStudentViaToken(token, 'basic', personal);
            setStep('medical');
        } catch (e: any) {
            console.error(e);
            alert(`Error guardando información personal: ${getErrorMessage(e)}`);
        } finally {
            setSaving(false);
        }
    };

    const handleMedicalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Prepare medical profile
        const finalMedical = {
            ...medical,
            allergies: {
                food: [],
                medications: [],
                environmental: allergiesText ? [allergiesText] : [] // Store free text in environmental catch-all
            }
        };

        try {
            await StudentService.updateStudentViaToken(token, 'medical', finalMedical);
            setStep('logistics');
        } catch (e: any) {
            console.error(e);
            alert(`Error guardando perfil médico: ${getErrorMessage(e)}`);
        } finally {
            setSaving(false);
        }
    };

    const handleLogisticsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await StudentService.updateStudentViaToken(token, 'logistics', logistics);
            setStep('documents');
        } catch (e: any) {
            console.error(e);
            alert(`Error guardando perfil logístico: ${getErrorMessage(e)}`);
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        // Validations
        if (type === 'passport' || type === 'visa_usa') {
            const meta = docMetadata[type];
            if (!meta?.number || !meta?.expiry) {
                alert(`Por favor ingresa primero el número y vigencia del ${type === 'passport' ? 'Pasaporte' : 'Visa'}.`);
                e.target.value = ''; // Reset
                return;
            }
        }

        try {
            const doc = await StudentService.uploadDocumentViaToken(token, file, type, {
                document_number: docMetadata[type]?.number,
                expiration_date: docMetadata[type]?.expiry
            });
            if (doc) {
                setUploadedDocs(prev => [doc, ...prev]);
            }
        } catch (e) {
            alert('Error subiendo documento. Verifique el tamaño (< 5MB) o intente de nuevo.');
        }
    };

    const handleComplete = () => {
        setStep('complete');
    };

    // --- Render Helpers ---

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Enlace No Válido</h2>
                <p className="text-slate-500 mt-2">{error}</p>
                <p className="text-sm text-slate-400 mt-4">Solicita un nuevo enlace al administrador.</p>
            </div>
        );
    }

    if (step === 'validating') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-slate-500">Validando acceso seguro...</p>
            </div>
        );
    }

    if (step === 'complete') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                <h2 className="text-2xl font-bold text-slate-800">¡Expediente Completado!</h2>
                <p className="text-slate-600 mt-2 max-w-md mx-auto">
                    Gracias por completar tu información. Hemos recibido tus datos y documentos correctamente.
                </p>
                <p className="text-slate-400 mt-8 text-sm">Puedes cerrar esta ventana.</p>
            </div>
        );
    }

    const steps = ['personal', 'medical', 'logistics', 'documents'];
    const currentStepIndex = steps.indexOf(step);

    return (
        <FadeIn>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {steps.map((s, idx) => (
                        <button
                            key={s}
                            onClick={() => setStep(s as Step)}
                            className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-slate-500 ${idx <= currentStepIndex ? 'text-primary' : 'text-slate-300'}`}
                        >
                            {s === 'personal' && 'Info'}
                            {s === 'medical' && 'Médico'}
                            {s === 'logistics' && 'Logística'}
                            {s === 'documents' && 'Docs'}
                        </button>
                    ))}
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                {step === 'personal' && (
                    <form onSubmit={handlePersonalSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900">Información Personal</h2>
                            <p className="text-slate-500 text-sm">Verifica que tus datos sean correctos.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre</label>
                                    <input
                                        type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                        value={personal.first_name}
                                        onChange={e => setPersonal({ ...personal, first_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido</label>
                                    <input
                                        type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                        value={personal.last_name}
                                        onChange={e => setPersonal({ ...personal, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Matrícula / ID</label>
                                    <input
                                        type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                        value={personal.educational_id || ''}
                                        placeholder="ej. A01234567"
                                        onChange={e => setPersonal({ ...personal, educational_id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Nacimiento</label>
                                    <input
                                        type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                        value={personal.birth_date}
                                        onChange={e => setPersonal({ ...personal, birth_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono (Celular Alumno)</label>
                                <input
                                    type="tel" className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                    value={personal.phone}
                                    onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección Completa</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white min-h-[80px]"
                                    placeholder="Calle, Número, Colonia, Ciudad, CP..."
                                    value={personal.address}
                                    onChange={e => setPersonal({ ...personal, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={saving} className="btn-primary w-full py-4 text-lg">
                            {saving ? 'Guardando...' : 'Continuar'}
                        </button>
                    </form>
                )}

                {step === 'medical' && (
                    <form onSubmit={handleMedicalSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900">Ficha Médica</h2>
                            <p className="text-slate-500 text-sm">Información crítica para la seguridad del alumno.</p>

                            {/* Emergency Contact */}
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-4">
                                <h3 className="font-semibold text-red-800 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Contacto de Emergencia
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-red-700 mb-1">Nombre Completo</label>
                                        <input
                                            type="text" className="w-full p-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                            value={(medical.emergency_contact as any)?.name || ''}
                                            onChange={e => setMedical({ ...medical, emergency_contact: { ...medical.emergency_contact as any, name: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-red-700 mb-1">Parentesco</label>
                                        <input
                                            type="text" className="w-full p-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                            placeholder="Padre, Madre, Tío..."
                                            value={(medical.emergency_contact as any)?.relationship || ''}
                                            onChange={e => setMedical({ ...medical, emergency_contact: { ...medical.emergency_contact as any, relationship: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-red-700 mb-1">Teléfono</label>
                                        <input
                                            type="tel" className="w-full p-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                            value={(medical.emergency_contact as any)?.phone || ''}
                                            onChange={e => setMedical({ ...medical, emergency_contact: { ...medical.emergency_contact as any, phone: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-red-700 mb-1">Correo Electrónico</label>
                                        <input
                                            type="email" className="w-full p-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                            value={(medical.emergency_contact as any)?.email || ''}
                                            onChange={e => setMedical({ ...medical, emergency_contact: { ...medical.emergency_contact as any, email: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Alergias</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white min-h-[60px]"
                                    placeholder="Escribe todas las alergias (Alimentos, Medicamentos, Ambientales). Si no tienes, escribe 'Ninguna'."
                                    value={allergiesText}
                                    onChange={e => setAllergiesText(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Padecimientos Crónicos o Condiciones</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white min-h-[80px]"
                                    placeholder="Ej. Asma, Diabetes, Problemas Cardiacos... (Escriba 'Ninguno' si aplica)"
                                    value={medical.conditions}
                                    onChange={e => setMedical({ ...medical, conditions: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Medicamentos Recetados (Especifique)</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white min-h-[80px]"
                                    placeholder="Nombre, dosis y frecuencia..."
                                    value={medical.medications}
                                    onChange={e => setMedical({ ...medical, medications: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-lg">
                            {saving ? 'Guardando...' : 'Guardar y Continuar'}
                        </button>
                    </form>
                )}

                {step === 'logistics' && (
                    <form onSubmit={handleLogisticsSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900">Logística</h2>
                            <p className="text-slate-500 text-sm">Detalles para que tu viaje sea perfecto.</p>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Restricciones Alimenticias</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {['Vegetariano', 'Vegano', 'Kosher', 'Halal', 'Sin Cerdo', 'Sin Res', 'Ninguna'].map(diet => (
                                        <label key={diet} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer transition-colors ${logistics.dietary_restrictions.includes(diet as any)
                                            ? 'bg-primary/10 border-primary text-primary font-medium'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}>
                                            <input
                                                type="checkbox" className="hidden"
                                                checked={logistics.dietary_restrictions.includes(diet as any)}
                                                onChange={e => {
                                                    const current = logistics.dietary_restrictions;
                                                    const newValue = e.target.checked
                                                        ? [...current, diet as any]
                                                        : current.filter(d => d !== diet);
                                                    setLogistics({ ...logistics, dietary_restrictions: newValue });
                                                }}
                                            />
                                            {diet}
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2 italic">
                                    Nota: En caso de que el programa incluya algún plan de alimentos.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Necesidades Especiales / Notas Operativas</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white min-h-[100px]"
                                    placeholder="Ej. 'Miedo a las alturas', 'No sabe nadar', 'No puede subir muchas escaleras'..."
                                    value={logistics.special_needs}
                                    onChange={e => setLogistics({ ...logistics, special_needs: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-lg">
                            {saving ? 'Guardando...' : 'Guardar y Continuar'}
                        </button>
                    </form>
                )}

                {step === 'documents' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">Documentación</h2>
                            <p className="text-slate-500 text-sm">Sube fotos o PDFs claros de tus documentos.</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { id: 'passport', label: 'Pasaporte', required: true, details: true },
                                { id: 'visa_usa', label: 'Visa Americana', required: true, details: true },
                                { id: 'medical_proof', label: 'Póliza de Seguro Médico', required: false, hidden_upload: true }, // Placeholder
                                { id: 'service_contract', label: 'Contrato Firmado', required: false, hidden_upload: true }, // Placeholder
                                { id: 'code_of_conduct', label: 'Reglamento Firmado', required: false, hidden_upload: true }, // Placeholder
                            ].map((docType) => {
                                const uploaded = uploadedDocs.find(d => d.document_type === docType.id);
                                const isDetailsRequired = docType.details;
                                const isHiddenUpload = docType.hidden_upload;

                                return (
                                    <div key={docType.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="font-medium text-slate-800 flex items-center gap-2">
                                                {docType.label}
                                                {docType.required && !uploaded && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Requerido</span>}
                                            </div>
                                            {uploaded && (
                                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Listo
                                                </div>
                                            )}
                                        </div>

                                        {/* Extra Info for Passport/Visa */}
                                        {isDetailsRequired && !uploaded && (
                                            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-3 space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Número de Documento</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-2 border border-slate-200 rounded text-sm uppercase"
                                                            placeholder="Ej. G12345678"
                                                            value={docMetadata[docType.id as DocumentType]?.number || ''}
                                                            onChange={e => setDocMetadata({
                                                                ...docMetadata,
                                                                [docType.id]: { ...docMetadata[docType.id as DocumentType], number: e.target.value, expiry: docMetadata[docType.id as DocumentType]?.expiry || '' }
                                                            })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Vigencia (Vencimiento)</label>
                                                        <input
                                                            type="date"
                                                            className="w-full p-2 border border-slate-200 rounded text-sm"
                                                            value={docMetadata[docType.id as DocumentType]?.expiry || ''}
                                                            onChange={e => setDocMetadata({
                                                                ...docMetadata,
                                                                [docType.id]: { ...docMetadata[docType.id as DocumentType], expiry: e.target.value, number: docMetadata[docType.id as DocumentType]?.number || '' }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                                <a href="#" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                                                    <Info className="w-3 h-3" />
                                                    ¿Cómo ubico estos datos? (Instructivo)
                                                </a>
                                            </div>
                                        )}

                                        {isHiddenUpload ? (
                                            <div className="text-xs text-slate-400 italic">
                                                {docType.id === 'medical_proof' ? 'Lo tramitamos nosotros.' : 'Se firmará digitalmente próximamente.'}
                                            </div>
                                        ) : (
                                            <div>
                                                {uploaded ? (
                                                    <div className="text-xs text-slate-500">
                                                        Documento subido el {new Date(uploaded.created_at).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <label className="btn bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm py-2 px-3 flex items-center justify-center gap-2 cursor-pointer shadow-sm w-full">
                                                        <Upload className="w-4 h-4" />
                                                        Subir Documento
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            onChange={(e) => handleFileUpload(e, docType.id as DocumentType)}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button onClick={handleComplete} className="btn-primary w-full py-3 text-lg mt-8">
                            Finalizar Expediente
                        </button>
                    </div>
                )}
            </div>
        </FadeIn>
    );
}
