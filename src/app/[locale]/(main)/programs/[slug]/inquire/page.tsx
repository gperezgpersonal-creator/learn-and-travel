"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MOCK_LEADS, Lead } from '@/services/mock/mockData';
import { programs } from '@/lib/programs';
import { MOCK_PROGRAMS } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { Link } from '@/navigation';

export default function InquirePage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    // Find program details (CMS or Static)
    const program = MOCK_PROGRAMS.find(p => p.slug === slug) || programs.find(p => p.id === slug);

    const [formData, setFormData] = useState({
        name: '',
        school: '',
        studentId: '',
        phone: '',
        educationalEmail: '',
        personalEmail: '',
        privacyAccepted: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create new Lead
        const newLead: Lead = {
            id: `lead-${Date.now()}`,
            internalId: `S-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Mock consecutive
            name: formData.name,
            email: formData.personalEmail, // Primary contact
            phone: formData.phone,
            programId: slug,
            status: 'new',
            createdAt: new Date().toISOString(),
            source: 'Web Form',
            school: formData.school,
            studentId: formData.studentId,
            educationalEmail: formData.educationalEmail,
            personalEmail: formData.personalEmail,
            privacyAccepted: formData.privacyAccepted
        };

        // Add to mock data (in memory)
        MOCK_LEADS.unshift(newLead);

        // Simulate sending automated email
        console.log(`[AUTOMATION] Sending email to ${formData.personalEmail} and ${formData.educationalEmail} with program info for ${slug}...`);
        console.log(`[AUTOMATION] Email Content: "Hola ${formData.name}, gracias por tu interés en ${program?.title || slug}. Aquí tienes la información..."`);

        // Redirect to Thank You page
        router.push(`/programs/${slug}/thank-you`);
    };

    if (!program) {
        return <div className="p-8 text-center">Program not found</div>;
    }

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom max-w-2xl">
                <Link href={`/programs/${slug}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver al Programa
                </Link>

                <FadeIn direction="up">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 p-8 text-white">
                            <h1 className="text-2xl font-serif font-bold mb-2">Solicitar Información</h1>
                            <p className="text-slate-300">
                                Completa el formulario para recibir todos los detalles de <span className="text-white font-semibold">{program.title || slug}</span>.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Escuela (Si aplica)</label>
                                    <input
                                        type="text"
                                        name="school"
                                        value={formData.school}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="Ej. Prepa Tec"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula / ID (Si aplica)</label>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="Ej. A01234567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (WhatsApp) *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="+52 55 1234 5678"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Correo Institucional</label>
                                    <input
                                        type="email"
                                        name="educationalEmail"
                                        value={formData.educationalEmail}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="juan@tec.mx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Correo Personal *</label>
                                    <input
                                        type="email"
                                        name="personalEmail"
                                        required
                                        value={formData.personalEmail}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="juan@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="privacyAccepted"
                                            required
                                            checked={formData.privacyAccepted}
                                            onChange={handleChange}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <CheckCircle className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                                        He leído y acepto el <a href="#" className="text-primary underline hover:text-primary/80">Aviso de Privacidad</a>. Entiendo que recibiré información sobre el programa.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>Enviando...</>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" /> Enviar Solicitud
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
