
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { tecPrograms } from '@/data/programs';
import { useTranslations } from 'next-intl';

export default function LeadFormPage() {
    const params = useParams();
    const programId = params.programId as string;
    const router = useRouter();
    const t = useTranslations('Form');

    // Find program 
    const program = tecPrograms.find(p => p.id === programId);

    // Specific logic for Program 84 (Tec de Monterrey)
    const isTecProgram = programId === '84-ORL2026';

    const [formData, setFormData] = useState({
        name: '',
        email: '', // Standard email (acts as personal or general)
        phone: '+52', // Default prefix
        interest: '',
        // Tec specific
        matricula: '',
        birthDate: '', // New field
        email_institucional: '',
        email_personal: '',
        escuela: 'Tec de Monterrey', // Default
        campus: '',
        aviso_privacidad: false
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    if (!program) return null; // Or 404 component

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Custom Validation
        if (isTecProgram) {
            // Phone Validation: Check if it has exactly 10 digits after +52
            // The value is like "+521234567890" (length 13) or "+521234567890" -> actually logic below maintains +52
            const phoneDigits = formData.phone.replace('+52', '').replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                alert('El teléfono debe tener 10 dígitos.');
                return;
            }
        }

        setStatus('loading');

        try {
            const payload = isTecProgram ? {
                programId: program.id,
                name: formData.name,
                phone: formData.phone,
                matricula: formData.matricula,
                email_institucional: formData.email_institucional, // Already full email
                email_personal: formData.email_personal,
                escuela: formData.escuela,
                campus: formData.campus,
                birthDate: formData.birthDate,
                aviso_privacidad: formData.aviso_privacidad,
            } : {
                programId: program.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                interest: formData.interest
            };

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setTimeout(() => {
                    if (data.redirectUrl) router.push(data.redirectUrl);
                }, 1500);
            } else {
                console.error(data.error);
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    // --- RENDER FOR SPECIFIC PROGRAMS ---

    if (isTecProgram) {
        return (
            <div className="min-h-screen bg-white text-[#122045] flex flex-col items-center justify-center p-4 selection:bg-[#00929F] selection:text-white">
                <div className="w-full max-w-lg">
                    {/* Minimal Header */}
                    <div className="mb-8 text-center">
                        <span className="text-[#00929F] font-bold tracking-widest text-xs uppercase mb-2 block">Programa Internacional</span>
                        <h1 className="text-3xl md:text-4xl font-sans font-bold text-[#122045] mb-4 tracking-tight">{program.title}</h1>
                        <p className="text-slate-500 text-sm font-medium mb-4">{program.location} • {program.date}</p>
                        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed border-t border-slate-100 pt-4">
                            Gracias por tu interés en este programa, te pedimos que llenes tus datos y te enviaremos la información del programa a tu correo.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Group: Personal */}
                        <div className="space-y-4">
                            <InputField
                                label="Nombre Completo"
                                value={formData.name}
                                onChange={v => setFormData({ ...formData, name: v })}
                                placeholder="Nombre y Apellidos"
                                theme="light"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Matrícula / ID (Obligatorio)"
                                    value={formData.matricula}
                                    onChange={v => setFormData({ ...formData, matricula: v })}
                                    placeholder="ID / Matrícula"
                                    theme="light"
                                    required
                                    maxLength={9}
                                    helperText="Máximo 9 caracteres"
                                />
                                <InputField
                                    label="Teléfono (10 dígitos)"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={v => {
                                        // Force +52 prefix and allow only digits
                                        const input = v;
                                        // If user tries to delete prefix, restore it
                                        // If user types digits, append them if valid

                                        // Simple logic: Strip non-digits/plus, ensure starts with +52
                                        let clean = input.replace(/[^0-9+]/g, '');
                                        if (!clean.startsWith('+52')) {
                                            clean = '+52' + clean.replace(/\+52/g, '').replace(/\+/g, '');
                                        }

                                        // Limit length: +52 + 10 digits = 13 chars
                                        if (clean.length <= 13) {
                                            setFormData({ ...formData, phone: clean });
                                        }
                                    }}
                                    placeholder="+52..."
                                    theme="light"
                                    required
                                />
                            </div>
                        </div>

                        {/* Group: Academic */}
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Fecha de Nacimiento"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={v => setFormData({ ...formData, birthDate: v })}
                                    theme="light"
                                    required
                                />
                                <InputField
                                    label="Correo Institucional"
                                    type="text"
                                    value={formData.email_institucional.replace('@tec.mx', '')}
                                    onChange={v => {
                                        // Prevent @ symbol
                                        const clean = v.replace(/@/g, '');
                                        setFormData({ ...formData, email_institucional: clean + '@tec.mx' })
                                    }}
                                    placeholder="ID..."
                                    theme="light"
                                    required
                                    suffix="@tec.mx"
                                    helperText="Ingresa solo tu ID (el dominio @tec.mx se agrega automático)"
                                />
                            </div>

                            <InputField
                                label="Correo Personal"
                                type="email"
                                required={false}
                                value={formData.email_personal}
                                onChange={v => setFormData({ ...formData, email_personal: v })}
                                placeholder="@gmail.com"
                                theme="light"
                                helperText="Si tu correo educativo no es de 9 dígitos utiliza el personal para cualquier caso"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Institución"
                                    value={formData.escuela}
                                    onChange={v => setFormData({ ...formData, escuela: v })}
                                    placeholder="Ej. Tec de Monterrey"
                                    theme="light"
                                    required // Though pre-filled
                                />
                                <InputField
                                    label="Campus / Ciudad (Obligatorio)"
                                    value={formData.campus}
                                    onChange={v => setFormData({ ...formData, campus: v })}
                                    placeholder="Ej. Santa Fe"
                                    theme="light"
                                    required
                                />
                            </div>
                        </div>

                        {/* Privacy Checkbox */}
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="privacy"
                                required
                                checked={formData.aviso_privacidad}
                                onChange={e => setFormData({ ...formData, aviso_privacidad: e.target.checked })}
                                className="mt-1 w-4 h-4 rounded border-gray-300 bg-transparent text-[#00929F] focus:ring-[#00929F]"
                            />
                            <label htmlFor="privacy" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                                He leído y acepto el <a href="/es/privacy-policy" target="_blank" className="underline hover:text-[#00929F]">Aviso de Privacidad</a>. Entiendo que mis datos serán tratados para fines académicos y de logística del viaje.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full bg-[#122045] text-white py-4 rounded-lg font-bold text-sm tracking-wide uppercase hover:bg-[#00929F] hover:shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 mt-6"
                        >
                            {status === 'loading' ? 'Procesando...' : 'Enviar'}
                        </button>

                        {status === 'success' && (
                            <div className="text-green-600 text-center text-sm font-medium mt-4 bg-green-50 p-2 rounded-lg animate-pulse">
                                Estás siendo redirigido al programa...
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="text-red-500 text-center text-sm font-medium mt-4">
                                Error al enviar. Verifica tus datos.
                            </div>
                        )}

                    </form>

                    <div className="mt-12 text-center opacity-80">
                        <Image src="/logo.png" alt="Logo" width={120} height={50} className="mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    // --- STANDARD LAYOUT (For other programs) ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#122045] to-[#1a2d5c] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Program Info */}
                <div className="md:w-1/2 relative bg-slate-900 text-white p-12 flex flex-col justify-between">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <Image
                            src={program.image}
                            alt={program.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[#00929F]/20 mix-blend-overlay"></div>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-serif font-bold mb-4">{program.title}</h1>
                        <p className="text-slate-200">{program.description}</p>
                    </div>
                </div>

                {/* Right Side: Simple Form */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-[#122045] mb-6">Regístrate</h2>
                        <InputField
                            label="Nombre"
                            value={formData.name}
                            onChange={v => setFormData({ ...formData, name: v })}
                            theme="light"
                        />
                        <InputField
                            label="Correo"
                            type="email"
                            value={formData.email}
                            onChange={v => setFormData({ ...formData, email: v })}
                            theme="light"
                        />
                        <InputField
                            label="Teléfono"
                            type="tel"
                            value={formData.phone}
                            onChange={v => setFormData({ ...formData, phone: v })}
                            theme="light"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-[#122045] text-white py-4 rounded-xl font-bold hover:bg-[#00929F] transition-all disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Enviando...' : 'Más Información'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Reusable Input Component for cleanness
interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    theme?: 'light' | 'dark';
    suffix?: string; // Suffix prop
    helperText?: string; // New helper text prop
    maxLength?: number;
}

function InputField({ label, value, onChange, type = 'text', placeholder, required = true, theme = 'dark', suffix, helperText, maxLength }: InputFieldProps) {
    const isDark = theme === 'dark';
    return (
        <div className="space-y-1">
            <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                {label} {required ? '' : '(Opcional)'}
            </label>
            <div className="relative flex items-center">
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`w-full px-4 py-3 rounded-lg outline-none transition-all ${isDark
                        ? 'bg-[#1E1E1E] border border-gray-800 text-white focus:border-[#00929F] focus:ring-1 focus:ring-[#00929F] placeholder-gray-600'
                        : 'bg-white border border-slate-300 text-slate-800 focus:border-[#00929F] focus:ring-1 focus:ring-[#00929F]'
                        } ${suffix ? 'pr-20' : ''}`} // Add padding for suffix
                />
                {suffix && (
                    <span className="absolute right-4 text-slate-400 font-medium pointer-events-none select-none">
                        {suffix}
                    </span>
                )}
            </div>
            {helperText && (
                <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'} mt-1`}>
                    {helperText}
                </p>
            )}
        </div>
    );
}

