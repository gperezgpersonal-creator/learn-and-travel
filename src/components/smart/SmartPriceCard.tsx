'use client';

import { useEffect, useState } from 'react';
import { ProgramService } from '@/services/supabase/programService';
import { Program } from '@/services/mock/mockData';
import PaymentPlanSelector from '@/components/cart/PaymentPlanSelector';

interface SmartPriceCardProps {
    programId: string; // Internal ID like '84-ORL2026' or UUID
    className?: string;
}

export default function SmartPriceCard({ programId, className }: SmartPriceCardProps) {
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            let data: Program | null = null;
            // Try fetching by internal ID first (e.g. 84-ORL2026)
            data = await ProgramService.getProgramByInternalId(programId);

            // If not found, try by UUID or Slug fallback (though we expect internalId majority of time)
            if (!data) {
                data = await ProgramService.getProgramById(programId);
            }
            if (!data) {
                // Last resort try slug
                data = await ProgramService.getProgramBySlug(programId);
            }

            setProgram(data);
            setLoading(false);
        };

        if (programId) fetchProgram();
    }, [programId]);

    if (loading) return <div className="animate-pulse bg-gray-100 rounded-lg h-64 w-full"></div>;
    if (!program) return null;

    // Use existing PaymentPlanSelector which handles the logic
    return (
        <div className={className}>
            <PaymentPlanSelector
                price={program.price}
                plans={program.plans}
                programName={program.title}
                image={program.image}
            />
        </div>
    );
}
