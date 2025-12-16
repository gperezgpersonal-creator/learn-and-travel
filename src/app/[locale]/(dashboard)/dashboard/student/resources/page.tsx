'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/mock/studentService';
import { Resource } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { Video, FileText, Download, PlayCircle } from 'lucide-react';

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const res = await studentService.getResources();
            setResources(res);
            setLoading(false);
        };
        loadData();
    }, []);

    const videos = resources.filter(r => r.type === 'video');
    const documents = resources.filter(r => r.type === 'pdf');

    if (loading) return <div className="p-8">Loading resources...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Learning Center</h1>
                        <p className="text-slate-500">Prepare for your trip with our curated guides and tutorials.</p>
                    </div>
                </div>
            </FadeIn>

            {/* Video Library */}
            <FadeIn delay={0.1}>
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Video className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-slate-800">Video Tutorials</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {videos.map((video, index) => (
                            <div key={video.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                                <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                                    {/* Placeholder for thumbnail */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{video.title}</h3>
                                    <p className="text-xs text-slate-400 mt-1">5 min watch</p>
                                </div>
                            </div>
                        ))}
                        {/* Placeholder Videos */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                            <div className="aspect-video bg-slate-200 relative flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800">Airport Check-in Guide</h3>
                                <p className="text-xs text-slate-400 mt-1">3 min watch</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                            <div className="aspect-video bg-slate-200 relative flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800">Using the London Tube</h3>
                                <p className="text-xs text-slate-400 mt-1">8 min watch</p>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Downloads */}
            <FadeIn delay={0.2}>
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Download className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-slate-800">Useful Downloads</h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                        {documents.map((doc) => (
                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-50 p-3 rounded-lg text-red-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{doc.title}</h3>
                                        <p className="text-xs text-slate-400">PDF Document • 2.4 MB</p>
                                    </div>
                                </div>
                                <button className="btn btn-outline py-2 px-4 text-xs flex items-center gap-2">
                                    <Download className="w-3 h-3" /> Download
                                </button>
                            </div>
                        ))}
                        {/* More placeholders */}
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-50 p-3 rounded-lg text-red-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Emergency Contact Card</h3>
                                    <p className="text-xs text-slate-400">PDF Document • 0.5 MB</p>
                                </div>
                            </div>
                            <button className="btn btn-outline py-2 px-4 text-xs flex items-center gap-2">
                                <Download className="w-3 h-3" /> Download
                            </button>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
