'use client';

import { useEffect, useState } from 'react';
import { FinanceService, Student } from '@/services/supabase/financeService';
import { supabase } from '@/lib/supabase';
import { Loader2, Search, Plus, User, ArrowRight, HeartPulse, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from '@/navigation';
import { StudentDocument } from '@/types/student';

export default function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [documents, setDocuments] = useState<Record<string, StudentDocument[]>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // New Student Form State
    const [newStudent, setNewStudent] = useState({ first_name: '', last_name: '', email: '', phone: '', educational_id: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const [studentsData, docsData] = await Promise.all([
                FinanceService.getAllStudents(),
                supabase.from('student_documents').select('*')
            ]);

            setStudents(studentsData);

            // Group docs by student
            const docsMap: Record<string, StudentDocument[]> = {};
            if (docsData.data) {
                docsData.data.forEach((doc: any) => {
                    const d = doc as StudentDocument;
                    if (!docsMap[d.student_id]) docsMap[d.student_id] = [];
                    docsMap[d.student_id].push(d);
                });
            }
            setDocuments(docsMap);
        } catch (error) {
            console.error('Failed to load students', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await FinanceService.createStudent(newStudent);
            await loadStudents();
            setShowCreateModal(false);
            setNewStudent({ first_name: '', last_name: '', email: '', phone: '', educational_id: '' });
        } catch (error) {
            console.error('Failed to create student', error);
            alert('Failed to create student.');
        } finally {
            setCreating(false);
        }
    };

    const filteredStudents = students.filter(s =>
        (s.first_name + ' ' + s.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.human_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Student
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                            {/* Removed Salud */}
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Docs</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total Charges</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total Paid</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Current Balance</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                            const balance = student.balance || 0;
                            const hasDebt = balance > 0;
                            return (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{student.first_name} {student.last_name}</div>
                                                <div className="text-xs text-slate-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{student.human_id}</td>

                                    {/* Docs Indicator */}
                                    <td className="px-6 py-4 text-center">
                                        {(() => {
                                            const myDocs = documents[student.id] || [];
                                            // Required docs: Passport, Visa, Insurance, Contract, Regulation
                                            // Note: User mentioned "Para subir si tenemos pasaporte, visa, seguro, contrado, reglamento"
                                            const requiredTypes = ['passport', 'visa_usa', 'medical_proof', 'service_contract', 'code_of_conduct'];

                                            // Check which are present
                                            const presentDocs = requiredTypes.filter(type =>
                                                myDocs.some(d => d.document_type === type)
                                            );

                                            const isComplete = presentDocs.length === requiredTypes.length;
                                            const missingDocs = requiredTypes.filter(type => !presentDocs.includes(type));

                                            // Map types to simpler names for tooltip
                                            const docNames: Record<string, string> = {
                                                passport: 'Pasaporte',
                                                visa_usa: 'Visa',
                                                medical_proof: 'Seguro',
                                                service_contract: 'Contrato',
                                                code_of_conduct: 'Reglamento'
                                            };

                                            if (isComplete) {
                                                return (
                                                    <div className="flex justify-center group/tooltip relative">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                                                            Completo ({presentDocs.length}/{requiredTypes.length})
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="flex justify-center group/tooltip relative">
                                                    <div className="flex items-center gap-1 text-amber-600 font-medium text-xs">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>{presentDocs.length}/{requiredTypes.length}</span>
                                                    </div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap z-10 pointer-events-none text-left">
                                                        <div className="font-semibold mb-1">Faltan:</div>
                                                        {missingDocs.map(d => <div key={d}>• {docNames[d]}</div>)}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600 text-right">${(student.total_charges || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-green-600 text-right">${(student.total_payments || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${hasDebt ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            ${balance.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/dashboard/admin/students/${student.id}`}
                                            className="text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline text-sm font-medium flex items-center justify-end gap-1"
                                        >
                                            View Profile <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Student</h2>
                        <form onSubmit={handleCreateStudent} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-2 border border-slate-300 rounded-lg"
                                        value={newStudent.first_name}
                                        onChange={e => setNewStudent({ ...newStudent, first_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-2 border border-slate-300 rounded-lg"
                                        value={newStudent.last_name}
                                        onChange={e => setNewStudent({ ...newStudent, last_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula / ID Educativo</label>
                                <input
                                    required
                                    type="text"
                                    placeholder='Ej. A01234567'
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                    value={newStudent.educational_id}
                                    onChange={e => setNewStudent({ ...newStudent, educational_id: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                    value={newStudent.email}
                                    onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    className="w-full p-2 border border-slate-300 rounded-lg"
                                    value={newStudent.phone}
                                    onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
