"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import FadeIn from '@/components/ui/FadeIn';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { Link } from '@/navigation';

export default function ThankYouPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <main className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
            <div className="container-custom max-w-lg">
                <FadeIn direction="up">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle className="w-10 h-10" />
                        </div>

                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">¡Gracias!</h1>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            Hemos recibido tu solicitud correctamente. En breve recibirás un correo electrónico con toda la información del programa.
                        </p>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8 flex items-start gap-3 text-left">
                            <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">
                                <strong>Revisa tu bandeja de entrada</strong> (y SPAM por si acaso). Te hemos enviado el brochure y los siguientes pasos.
                            </p>
                        </div>

                        <Link
                            href={`/programs/${slug}`}
                            className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2"
                        >
                            Volver al Programa <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
