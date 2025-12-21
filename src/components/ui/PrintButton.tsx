'use client';
import { Download } from 'lucide-react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
            <Download className="w-4 h-4" />
            Descargar PDF
        </button>
    );
}
