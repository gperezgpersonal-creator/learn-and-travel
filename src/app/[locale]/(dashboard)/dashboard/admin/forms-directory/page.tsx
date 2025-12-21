'use client';

import { tecPrograms } from '@/data/programs';
import { ExternalLink, Copy } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

export default function FormsDirectory() {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    return (
        <div className="space-y-8">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Programas y Formularios</h1>
                    <p className="text-slate-500">Lista maestra de ligas de registro para programas.</p>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-bold text-slate-500">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Programa</th>
                                    <th className="p-4">Fecha / Campus</th>
                                    <th className="p-4">Liga de Formulario</th>
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tecPrograms.map((program) => {
                                    const formLink = `${origin}/en/programs/forms/${program.id}`;

                                    return (
                                        <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-slate-500 text-xs font-bold">{program.id}</td>
                                            <td className="p-4 font-bold text-slate-700">
                                                <div>{program.title}</div>
                                                <a
                                                    href={`${origin}/programs/tec-de-monterrey/${program.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary font-normal hover:underline flex items-center gap-1 mt-1"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> Ver Programa
                                                </a>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                <div className="flex flex-col">
                                                    <span>{program.date}</span>
                                                    <span className="text-xs">{program.location}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <a
                                                    href={formLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline hover:text-blue-700 flex items-center gap-1 font-medium truncate max-w-[300px]"
                                                >
                                                    {formLink}
                                                </a>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(formLink)}
                                                        className="p-2 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700 transition"
                                                        title="Copiar Link"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={formLink}
                                                        target="_blank"
                                                        className="p-2 hover:bg-slate-200 rounded text-slate-500 hover:text-primary transition"
                                                        title="Abrir Formulario"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
