'use client';

import { Program } from '@/services/mock/mockData';
import { Edit, DollarSign, Calendar } from 'lucide-react';

interface ProgramListProps {
    programs: Program[];
    onEdit: (id: string) => void;
}

export default function ProgramList({ programs, onEdit }: ProgramListProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Programas Activos</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">ID Interno</th>
                            <th className="px-6 py-4">Nombre del Programa</th>
                            <th className="px-6 py-4">Precio Público</th>
                            <th className="px-6 py-4">Planes Activos</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                        {programs.map((program) => (
                            <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">{program.internalId || program.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">{program.title}</td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-green-600">
                                        {program.currency === 'USD' ? '$' : 'MXN$'}
                                        {program.price.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                        {program.plans?.filter(p => p.status === 'active').length || 0} Planes
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onEdit(program.id)}
                                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium text-sm border border-primary/20 hover:border-primary px-3 py-1.5 rounded-lg transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Gestionar Precios
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {programs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No hay programas registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
