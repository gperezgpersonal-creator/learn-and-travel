'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/mock/studentService';
import { Document } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { FileText, Upload, CheckCircle, AlertCircle, Clock, Eye, PenTool, X } from 'lucide-react';

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [signingDoc, setSigningDoc] = useState<Document | null>(null);

    // In a real app, we'd get this from context. For now, we assume we might be in "Parent Mode" if we see the sign button
    // But actually, we should probably toggle this based on the "Dev Controls" from the layout or just local state for demo
    // Let's assume we are viewing as the user who owns the docs, but if it requires signature, we show the button.

    useEffect(() => {
        const loadData = async () => {
            // We'll fetch for exemplary student by default, but in a real app this depends on auth
            // For the demo, we might want to reload this based on the dev toggle in the sidebar/layout
            // But since that state is in a different component, we'll just fetch 'student-exemplary' for now
            // OR better, we fetch based on a hardcoded ID that matches the "current" user from the previous page's context
            // Since we don't have global state, let's fetch 'student-problematic' to show the "Rejected" state features
            // and 'student-exemplary' to show "Signed" features.
            // Let's fetch ALL and filter in UI? No, let's just fetch 'student-problematic' to demonstrate the complex states.
            // Wait, the user wants to switch. 
            // I'll stick to 'student-problematic' here to show the features, or maybe I can read a localStorage key?
            // Let's just default to 'student-problematic' for now as it has more interesting states.
            const docs = await studentService.getDocuments('student-problematic');
            setDocuments(docs);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleUpload = async (docId: string, type: Document['type']) => {
        setUploading(docId);
        // Simulate file selection
        const mockFile = new File([''], 'document.pdf', { type: 'application/pdf' });
        await studentService.uploadDocument('student-problematic', type, mockFile);

        // Update local state
        setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'review', uploadedAt: new Date().toISOString().split('T')[0] } : d));
        setUploading(null);
    };

    const handleSign = (doc: Document) => {
        setSigningDoc(doc);
    };

    const confirmSign = () => {
        if (!signingDoc) return;
        // Update local state
        setDocuments(prev => prev.map(d => d.id === signingDoc.id ? { ...d, status: 'approved', isSigned: true } : d));
        setSigningDoc(null);
    };

    const personalDocs = documents.filter(d => ['passport', 'visa'].includes(d.type));
    const tripDocs = documents.filter(d => !['passport', 'visa'].includes(d.type));

    const StatusBadge = ({ status, feedback }: { status: Document['status'], feedback?: string }) => {
        if (status === 'approved') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase"><CheckCircle className="w-3 h-3" /> Approved</span>;
        if (status === 'review') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase"><Clock className="w-3 h-3" /> In Review</span>;
        if (status === 'rejected') return (
            <div className="group relative inline-block">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase cursor-help">
                    <AlertCircle className="w-3 h-3" /> Rejected
                </span>
                {feedback && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {feedback}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                )}
            </div>
        );
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase">Pending</span>;
    };

    if (loading) return <div className="p-8">Loading documents...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Documents Vault</h1>
                        <p className="text-slate-500">Manage your travel documents and legal forms.</p>
                    </div>
                </div>
            </FadeIn>

            {/* Personal Documents */}
            <FadeIn delay={0.1}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 font-bold text-slate-700">
                        Personal Documents
                    </div>
                    <div className="divide-y divide-slate-100">
                        {personalDocs.map(doc => (
                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${doc.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{doc.name}</h3>
                                        <p className="text-xs text-slate-400">Last updated: {doc.uploadedAt || 'Never'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={doc.status} feedback={doc.feedback} />
                                    {doc.status !== 'approved' && doc.status !== 'review' && (
                                        <button
                                            onClick={() => handleUpload(doc.id, doc.type)}
                                            disabled={uploading === doc.id}
                                            className="btn btn-outline py-2 px-4 text-xs flex items-center gap-2"
                                        >
                                            {uploading === doc.id ? <Clock className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                            {doc.status === 'rejected' ? 'Re-upload' : 'Upload'}
                                        </button>
                                    )}
                                    {doc.status === 'approved' && (
                                        <button className="text-slate-400 hover:text-primary">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* Trip Documents */}
            <FadeIn delay={0.2}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 font-bold text-slate-700">
                        Trip Documents & Forms
                    </div>
                    <div className="divide-y divide-slate-100">
                        {tripDocs.map(doc => (
                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${doc.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{doc.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-slate-400">Last updated: {doc.uploadedAt || 'Never'}</p>
                                            {doc.requiresSignature && !doc.isSigned && (
                                                <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Requires Signature</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <StatusBadge status={doc.status} feedback={doc.feedback} />

                                    {doc.requiresSignature && !doc.isSigned ? (
                                        <button
                                            onClick={() => handleSign(doc)}
                                            className="btn btn-primary py-2 px-4 text-xs flex items-center gap-2"
                                        >
                                            <PenTool className="w-3 h-3" /> Sign Document
                                        </button>
                                    ) : doc.status !== 'approved' && doc.status !== 'review' ? (
                                        <button
                                            onClick={() => handleUpload(doc.id, doc.type)}
                                            disabled={uploading === doc.id}
                                            className="btn btn-outline py-2 px-4 text-xs flex items-center gap-2"
                                        >
                                            {uploading === doc.id ? <Clock className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                            Upload
                                        </button>
                                    ) : (
                                        <button className="text-slate-400 hover:text-primary">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* Signing Modal */}
            {signingDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSigningDoc(null)}></div>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">Sign Document: {signingDoc.name}</h3>
                            <button onClick={() => setSigningDoc(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto bg-slate-50">
                            <div className="prose prose-sm max-w-none">
                                <p><strong>TERMS AND CONDITIONS</strong></p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                <p><strong>1. CODE OF CONDUCT</strong></p>
                                <p>The student agrees to abide by all rules and regulations...</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-white rounded-b-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <input type="checkbox" id="agree" className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary" />
                                <label htmlFor="agree" className="text-sm text-slate-700 font-medium">
                                    I have read and agree to the terms and conditions stated above.
                                </label>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setSigningDoc(null)} className="btn btn-outline">Cancel</button>
                                <button onClick={confirmSign} className="btn btn-primary">Sign & Approve</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
