'use client';

import { useState } from 'react';
import FadeIn from '@/components/ui/FadeIn';
import {
    Zap, Mail, LayoutTemplate, Plus, ArrowRight,
    Settings, Play, Pause, Edit, Trash2, Link as LinkIcon, Copy, ExternalLink
} from 'lucide-react';
import { MOCK_PROGRAMS } from '@/services/mock/mockData';
import { Link } from '@/navigation';

export default function MarketingPage() {
    const [activeTab, setActiveTab] = useState<'triggers' | 'templates' | 'forms'>('triggers');

    const triggers = [
        { id: 1, name: 'Welcome Email', if: 'Form: General Interest', then: 'Email: Welcome Pack PDF', status: 'active' },
        { id: 2, name: 'Payment Reminder', if: 'Payment: Overdue 3 Days', then: 'Email: Friendly Reminder', status: 'active' },
        { id: 3, name: 'London Info', if: 'Form: London 2026', then: 'Email: London Brochure', status: 'paused' },
    ];

    const templates = [
        { id: 1, name: 'Welcome Pack PDF', subject: 'Welcome to Learn & Travel!', lastEdited: '2 days ago' },
        { id: 2, name: 'Friendly Reminder', subject: 'Action Required: Payment Overdue', lastEdited: '1 week ago' },
        { id: 3, name: 'London Brochure', subject: 'Discover London with us', lastEdited: '1 month ago' },
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Link copied to clipboard: ' + text);
    };

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Marketing Automation</h1>
                        <p className="text-slate-500">Nurture leads and automate communications.</p>
                    </div>
                    <button className="btn btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New {activeTab === 'triggers' ? 'Trigger' : activeTab === 'templates' ? 'Template' : 'Form'}
                    </button>
                </div>
            </FadeIn>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab('triggers')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'triggers' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Automation Triggers
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Email Templates
                </button>
                <button
                    onClick={() => setActiveTab('forms')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'forms' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Lead Forms
                </button>
            </div>

            {/* TRIGGERS VIEW */}
            {activeTab === 'triggers' && (
                <div className="space-y-4">
                    {triggers.map((trigger, index) => (
                        <FadeIn key={trigger.id} delay={index * 0.1}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`p-3 rounded-full ${trigger.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{trigger.name}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono text-xs">IF {trigger.if}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-300" />
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-mono text-xs">THEN {trigger.then}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-primary rounded-full hover:bg-slate-50">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                    <button className={`p-2 rounded-full hover:bg-slate-50 ${trigger.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                                        {trigger.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </FadeIn>
                    ))}

                    {/* Visual Builder Placeholder */}
                    <FadeIn delay={0.4}>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                            <Plus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="font-bold text-slate-500">Create Custom Workflow</p>
                        </div>
                    </FadeIn>
                </div>
            )}

            {/* TEMPLATES VIEW */}
            {activeTab === 'templates' && (
                <div className="grid md:grid-cols-3 gap-6">
                    {templates.map((template, index) => (
                        <FadeIn key={template.id} delay={index * 0.1}>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all">
                                <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-100 relative">
                                    <LayoutTemplate className="w-12 h-12 text-slate-300" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button className="p-2 bg-white rounded-full text-slate-800 hover:text-primary"><Edit className="w-5 h-5" /></button>
                                        <button className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-slate-800 mb-1">{template.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-1">Subject: {template.subject}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Mail className="w-3 h-3" />
                                        <span>Edited {template.lastEdited}</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            )}

            {/* FORMS VIEW */}
            {activeTab === 'forms' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                        <LinkIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-blue-800 text-sm">Lead Generation Forms</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                These forms are generated automatically for each program. Use the links below to distribute them to potential clients.
                                They are <strong>not</strong> publicly linked on the website navigation.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {MOCK_PROGRAMS.map((program, index) => (
                            <FadeIn key={program.id} delay={index * 0.1}>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-800 text-lg">{program.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${program.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                {program.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded inline-block">
                                            /programs/{program.slug}/inquire
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => copyToClipboard(`${window.location.origin}/programs/${program.slug}/inquire`)}
                                            className="btn btn-outline flex items-center gap-2 text-sm"
                                        >
                                            <Copy className="w-4 h-4" /> Copy Link
                                        </button>
                                        <Link
                                            href={`/programs/${program.slug}/inquire`}
                                            target="_blank"
                                            className="btn btn-secondary flex items-center gap-2 text-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Test Form
                                        </Link>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
