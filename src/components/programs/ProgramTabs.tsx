'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin, Calendar, Users, GraduationCap } from 'lucide-react';

interface Section {
    title: string;
    content?: string;
    list?: string[];
}

interface ProgramTabsProps {
    sections: Record<string, Section>;
}

export default function ProgramTabs({ sections }: ProgramTabsProps) {
    // We'll map the sections to specific tabs
    // 0: General -> Overview
    // 1: Who is it for -> Student Profile
    // 2: How it works -> Experience
    // 3: Differentiator -> Why Us (Grid)
    // 4: Results -> Outcomes (List)

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: MapPin, data: sections['0'] },
        { id: 'profile', label: 'Student Profile', icon: Users, data: sections['1'] },
        { id: 'experience', label: 'Experience', icon: Calendar, data: sections['2'] },
        { id: 'outcomes', label: 'Outcomes', icon: GraduationCap, data: sections['4'] },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
                <div className="sticky top-24 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-left transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.data?.title || tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="lg:w-3/4 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
                    >
                        {tabs.map((tab) => {
                            if (tab.id !== activeTab) return null;
                            const section = tab.data;
                            if (!section) return null;

                            return (
                                <div key={tab.id}>
                                    <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                                        {section.title}
                                    </h2>

                                    {section.content && (
                                        <div
                                            className="text-lg text-slate-600 leading-relaxed space-y-4"
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                        />
                                    )}

                                    {section.list && (
                                        <div className="mt-8 grid gap-4">
                                            {section.list.map((item, i) => (
                                                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                                    <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-slate-700 text-lg">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
