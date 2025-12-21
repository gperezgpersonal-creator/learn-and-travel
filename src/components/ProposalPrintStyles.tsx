'use client';

export default function ProposalPrintStyles() {
    return (
        <style jsx global>{`
            @media print {
                @page { margin: 0; }
                body {
                    background: white;
                    -webkit-print-color-adjust: exact; 
                }
                /* Hide navigation, floating buttons, etc */
                .no-print { display: none !important; }
                /* Ensure hero looks good / or maybe hide hero in print? Let's keep it but adjust height */
                .print-hero { height: 400px !important; }
            }
        `}</style>
    );
}
