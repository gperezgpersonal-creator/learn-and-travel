'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/services/mock/mockData';
import { ProgramService } from '@/services/supabase/programService';
import ProgramList from './ProgramList';
import PriceEditor from './PriceEditor';
import { Plus, X, Loader2 } from 'lucide-react';

export default function PricingManager() {
    const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newProgramId, setNewProgramId] = useState('');
    const [newProgramName, setNewProgramName] = useState('');

    useEffect(() => {
        loadPrograms();
    }, []);

    const loadPrograms = async () => {
        setLoading(true);
        try {
            const data = await ProgramService.getAll();
            setPrograms(data);
        } catch (error) {
            console.error("Failed to load programs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newProgramId || !newProgramName) return;
        try {
            await ProgramService.create({ id: newProgramId, title: newProgramName });
            await loadPrograms(); // Refresh list
            setIsCreating(false);
            setNewProgramId('');
            setNewProgramName('');
        } catch (error) {
            alert('Error creating program. ID might be duplicated.');
        }
    };

    const handleSave = async (updatedProgram: Program) => {
        // Optimistic update
        setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));

        try {
            await ProgramService.update(updatedProgram.id, {
                price: updatedProgram.price,
                slug: updatedProgram.slug,
                currency: updatedProgram.currency,
                plans: updatedProgram.plans,
                status: updatedProgram.status
            });
            setSelectedProgramId(null);
        } catch (error) {
            alert('Error saving changes to database.');
            loadPrograms(); // Revert on error
        }
    };

    if (loading && !selectedProgramId) {
        return <div className="p-12 text-center text-slate-400 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (selectedProgramId) {
        const program = programs.find(p => p.id === selectedProgramId);
        if (!program) return <div>Program not found</div>;

        return (
            <PriceEditor
                program={program}
                onBack={() => setSelectedProgramId(null)}
                onSave={handleSave}
            />
        );
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors"
                >
                    <Plus className="w-5 h-5" /> Nuevo Programa
                </button>
            </div>

            <ProgramList
                programs={programs}
                onEdit={setSelectedProgramId}
            />

            {/* Create Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-800">Crear Nuevo Programa</h3>
                            <button onClick={() => setIsCreating(false)}><X className="w-6 h-6 text-slate-400" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">ID del Programa (Único)</label>
                                <input
                                    type="text"
                                    placeholder="Ej. 85-NY2026"
                                    value={newProgramId}
                                    onChange={(e) => setNewProgramId(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">Este ID se usará para conectar la página web.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Programa</label>
                                <input
                                    type="text"
                                    placeholder="Ej. New York Summer 2026"
                                    value={newProgramName}
                                    onChange={(e) => setNewProgramName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary outline-none"
                                />
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={!newProgramId || !newProgramName}
                                className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 mt-4"
                            >
                                Crear Programa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
