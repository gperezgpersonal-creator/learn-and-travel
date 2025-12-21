'use client';

import { useEffect, useState } from 'react';
import { ProgramService } from '@/services/supabase/programService';
import { Program } from '@/services/mock/mockData';

interface SmartInclusionsProps {
    programId: string;
    className?: string;
}

export default function SmartInclusions({ programId, className }: SmartInclusionsProps) {
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            let data = await ProgramService.getProgramByInternalId(programId)
                || await ProgramService.getProgramById(programId)
                || await ProgramService.getProgramBySlug(programId);
            setProgram(data);
            setLoading(false);
        };
        if (programId) fetchProgram();
    }, [programId]);

    if (loading) return <div className="animate-pulse bg-gray-100 rounded-lg h-24 w-full"></div>;
    if (!program || !program.inclusions || program.inclusions.length === 0) return null;

    return (
        <ul className={`grid md:grid-cols-2 gap-3 ${className}`}>
            {program.inclusions.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}
