'use client';

import { tecPrograms } from '@/data/programs';
import { ExternalLink, Copy, Users, Grid, List as ListIcon, Download } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import React, { useState } from 'react';
import { StudentService } from '@/services/supabase/studentService';

export default function FormsDirectory() {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    const [studentsByProgram, setStudentsByProgram] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(false);
    const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const loadEnrollments = async (programId: string) => {
        if (studentsByProgram[programId]) {
            setExpandedProgram(expandedProgram === programId ? null : programId);
            return;
        }

        setLoading(true);
        try {
            // New service method needed: getProgramEnrollments
            // We'll trust it exists now or add it. I added it in previous steps.
            // Import StudentService top of file.
            const enrollments = await StudentService.getProgramEnrollments(programId);
            setStudentsByProgram(prev => ({ ...prev, [programId]: enrollments }));
            setExpandedProgram(programId);
        } catch (error) {
            console.error('Failed to load enrollments', error);
        } finally {
            setLoading(false);
        }
    };

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
                                    <th className="p-4">Inscritos</th>
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tecPrograms.map((program) => {
                                    const formLink = `${origin}/en/programs/forms/${program.id}`;
                                    const isExpanded = expandedProgram === program.id;
                                    const enrolledCount = studentsByProgram[program.id]?.length;

                                    return (
                                        <React.Fragment key={program.id}>
                                            <tr className="hover:bg-slate-50 transition-colors">
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
                                                    <button
                                                        onClick={() => loadEnrollments(program.id)}
                                                        className="text-slate-600 hover:text-primary font-bold flex items-center gap-1 bg-slate-100 px-3 py-1 rounded"
                                                    >
                                                        <Users className="w-4 h-4" />
                                                        {enrolledCount !== undefined ? enrolledCount : 'Ver'}
                                                    </button>
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
                                            {isExpanded && (
                                                <tr className="bg-slate-50">
                                                    <td colSpan={6} className="p-4">
                                                        <div className="bg-white border border-slate-200 rounded-lg p-4">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                                    <Users className="w-4 h-4" /> Alumnos Inscritos ({enrolledCount})
                                                                </h4>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex bg-slate-100 rounded-lg p-1">
                                                                        <button
                                                                            onClick={() => setViewMode('grid')}
                                                                            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                                                            title="Vista de cuadrícula"
                                                                        >
                                                                            <Grid className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setViewMode('list')}
                                                                            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                                                            title="Vista de lista"
                                                                        >
                                                                            <ListIcon className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            const data = studentsByProgram[program.id] || [];
                                                                            if (!data.length) return;

                                                                            const csvContent = [
                                                                                ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Enrolled At'],
                                                                                ...data.map((e: any) => [
                                                                                    e.students?.human_id || '',
                                                                                    e.students?.first_name || '',
                                                                                    e.students?.last_name || '',
                                                                                    e.students?.email || '',
                                                                                    e.students?.phone || '',
                                                                                    e.status || '',
                                                                                    e.created_at || ''
                                                                                ])
                                                                            ].map(e => e.join(',')).join('\n');

                                                                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                                                            const url = URL.createObjectURL(blob);
                                                                            const link = document.createElement('a');
                                                                            link.setAttribute('href', url);
                                                                            link.setAttribute('download', `${program.id}_students.csv`);
                                                                            document.body.appendChild(link);
                                                                            link.click();
                                                                            document.body.removeChild(link);
                                                                        }}
                                                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                                                    >
                                                                        <Download className="w-3 h-3" /> Descargar CSV
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {enrolledCount === 0 ? (
                                                                <p className="text-slate-500 italic text-sm">No hay alumnos inscritos aún.</p>
                                                            ) : (
                                                                <>
                                                                    {viewMode === 'grid' ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                            {studentsByProgram[program.id]?.map((enrollment: any) => (
                                                                                <div key={enrollment.id} className="flex flex-col p-3 border border-slate-100 rounded bg-slate-50 hover:bg-slate-100 transition relative">
                                                                                    <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-100">
                                                                                        {enrollment.students?.human_id}
                                                                                    </div>
                                                                                    <span className="font-bold text-slate-700 text-sm mt-1">
                                                                                        {enrollment.students?.first_name} {enrollment.students?.last_name}
                                                                                    </span>
                                                                                    <span className="text-xs text-slate-500">{enrollment.students?.email}</span>
                                                                                    <span className="text-xs text-slate-500">{enrollment.students?.phone}</span>
                                                                                    <span className="text-[10px] uppercase font-bold text-green-600 mt-1">{enrollment.status}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                                                            <table className="w-full text-sm text-left">
                                                                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-200">
                                                                                    <tr>
                                                                                        <th className="px-4 py-3">ID</th>
                                                                                        <th className="px-4 py-3">Nombre</th>
                                                                                        <th className="px-4 py-3">Email</th>
                                                                                        <th className="px-4 py-3">Teléfono</th>
                                                                                        <th className="px-4 py-3">Status</th>
                                                                                        <th className="px-4 py-3">Fecha Inscripción</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-slate-100">
                                                                                    {studentsByProgram[program.id]?.map((enrollment: any) => (
                                                                                        <tr key={enrollment.id} className="hover:bg-slate-50">
                                                                                            <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                                                                                {enrollment.students?.human_id || '-'}
                                                                                            </td>
                                                                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                                                                {enrollment.students?.first_name} {enrollment.students?.last_name}
                                                                                            </td>
                                                                                            <td className="px-4 py-3 text-slate-600">{enrollment.students?.email}</td>
                                                                                            <td className="px-4 py-3 text-slate-600 font-mono text-xs">{enrollment.students?.phone || '-'}</td>
                                                                                            <td className="px-4 py-3">
                                                                                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">
                                                                                                    {enrollment.status}
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className="px-4 py-3 text-slate-500 text-xs">
                                                                                                {new Date(enrollment.created_at).toLocaleDateString()}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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
