'use client';

import { useEffect, useState } from 'react';
import { ProgramService } from '@/services/supabase/programService';
import { Program } from '@/services/mock/mockData';

interface SmartItineraryProps {
    programId: string;
    className?: string;
}

export default function SmartItinerary({ programId, className }: SmartItineraryProps) {
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

    if (loading) return <div className="animate-pulse bg-gray-100 rounded-lg h-32 w-full"></div>;
    if (!program || !program.itinerary || program.itinerary.length === 0) return null;

    return (
        <div className={`space-y-6 ${className}`}>
            {program.itinerary.map((day) => (
                <div key={day.day} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary font-bold flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        {day.day}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900">{day.title}</h4>
                        <p className="text-slate-600 leading-relaxed mt-1">{day.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
