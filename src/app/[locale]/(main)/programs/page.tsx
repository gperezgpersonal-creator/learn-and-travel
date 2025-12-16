'use client';

import { useTranslations } from 'next-intl';
import { programs } from '@/lib/programs';
import { useState } from 'react';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';

export default function ProgramsPage() {
    const t = useTranslations('Programs');
    const tPrograms = useTranslations('ProgramsData');
    const [filterType, setFilterType] = useState('all');

    const filteredPrograms = filterType === 'all'
        ? programs
        : programs.filter(p => p.type === filterType);

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom">
                <FadeIn direction="up">
                    <h1 className="text-center mb-12 text-4xl font-serif font-bold text-slate-900">{t('title')}</h1>
                </FadeIn>

                {/* Filters (Tabs) */}
                <FadeIn direction="up" delay={0.1}>
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['all', 'language', 'university', 'educational', 'camp', 'internship', 'custom'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterType === type
                                    ? 'bg-primary text-white shadow-md transform scale-105'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:shadow-sm'
                                    }`}
                            >
                                {t(`types.${type}`)}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPrograms.map((program, index) => (
                        <FadeIn key={program.id} direction="up" delay={0.1 * (index % 3)}>
                            <div className="card group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                                <div className="relative h-56 bg-slate-200 overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                                        style={{ backgroundImage: `url(${program.image})` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                                        {t(`status.${program.status}`)}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                            {t(`types.${program.type}`)}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {program.country}, {program.city}
                                        </span>
                                    </div>

                                    <h3 className="text-xl mb-3 font-bold text-slate-800 group-hover:text-primary transition-colors">{tPrograms(`${program.id}.title`)}</h3>
                                    <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">{tPrograms(`${program.id}.summary`)}</p>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">{program.dates}</span>
                                        <Link href={`/programs/${program.id}`} className="text-primary font-bold text-sm hover:text-accent transition-colors flex items-center gap-1">
                                            {t('viewDetails')}
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {filteredPrograms.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        {t('noResults')}
                    </div>
                )}
            </div>
        </main>
    );
}
