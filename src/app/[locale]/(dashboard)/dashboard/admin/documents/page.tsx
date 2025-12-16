'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/mock/adminService';
import { Document, User, MOCK_USERS } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import {
    Check, X, Eye, FileText, Filter, Search,
    CheckCircle, AlertTriangle
} from 'lucide-react';

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    useEffect(() => {
        const loadDocs = async () => {
            const docs = await adminService.getPendingDocuments();
            setDocuments(docs);
            setLoading(false);
        };
        loadDocs();
    }, []);

    const handleAction = async (docId: string, action: 'approved' | 'rejected') => {
        // Optimistic update
        setDocuments(prev => prev.filter(d => d.id !== docId));
        await adminService.updateDocumentStatus(docId, action);
        setSelectedDoc(null);
    };

    const getStudentName = (userId: string) => {
        const student = MOCK_USERS.find(u => u.id === userId);
        return student ? student.name : 'Unknown Student';
    };

    if (loading) return <div className="p-8">Loading verification queue...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Document Validation</h1>
                        <p className="text-slate-500">Review and approve student documentation.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search student..." className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                        </div>
                        <button className="btn btn-outline flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Document List */}
                <div className="md:col-span-1 space-y-4">
                    {documents.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="font-bold text-slate-800">All Caught Up!</h3>
                            <p className="text-slate-500 text-sm">No pending documents to review.</p>
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <FadeIn key={doc.id}>
                                <div
                                    onClick={() => setSelectedDoc(doc)}
                                    className={`bg-white p-4 rounded-xl shadow-sm border cursor-pointer transition-all ${selectedDoc?.id === doc.id ? 'border-primary ring-1 ring-primary' : 'border-slate-100 hover:border-primary/50'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase">Review</span>
                                        <span className="text-xs text-slate-400">{doc.uploadedAt}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-1">{doc.name}</h4>
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                                            {getStudentName(doc.userId).charAt(0)}
                                        </span>
                                        {getStudentName(doc.userId)}
                                    </p>
                                </div>
                            </FadeIn>
                        ))
                    )}
                </div>

                {/* Preview Panel */}
                <div className="md:col-span-2">
                    <FadeIn delay={0.2}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-[600px] flex flex-col">
                            {selectedDoc ? (
                                <>
                                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{selectedDoc.name}</h3>
                                            <p className="text-xs text-slate-500">Uploaded by {getStudentName(selectedDoc.userId)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(selectedDoc.id, 'rejected')}
                                                className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" /> Reject
                                            </button>
                                            <button
                                                onClick={() => handleAction(selectedDoc.id, 'approved')}
                                                className="btn btn-primary bg-green-600 hover:bg-green-700 border-green-600 flex items-center gap-2"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center overflow-auto">
                                        {/* Mock Preview */}
                                        <div className="bg-white shadow-lg p-2 max-w-md w-full aspect-[3/4] flex flex-col items-center justify-center text-slate-300">
                                            <FileText className="w-24 h-24 mb-4" />
                                            <p className="font-bold">Document Preview</p>
                                            <p className="text-sm">(Passport / Visa Scan)</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                    <Eye className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="font-bold">Select a document to preview</p>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
