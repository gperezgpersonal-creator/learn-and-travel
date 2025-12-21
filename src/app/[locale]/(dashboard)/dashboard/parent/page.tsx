'use client';

import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';

export default function ParentDashboard() {
    return (
        <div className="space-y-8">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Portal de Padres</h1>
                    <p className="text-slate-500">Bienvenido al portal para padres de familia.</p>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-600">
                        Aquí podrás ver el progreso, itinerarios y documentos de tus hijos.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        🚧 Módulo en construcción
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
