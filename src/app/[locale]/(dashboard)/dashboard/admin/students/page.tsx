'use client';

import StudentList from '../finance/collections/components/StudentList';
import FadeIn from '@/components/ui/FadeIn';

import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export default function AdminStudentsPage() {
    return (
        <FadeIn>
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Directorio de Alumnos</h1>
                    <p className="text-slate-500 mt-2">Gestión general de alumnos y estados de cuenta.</p>
                </div>
                <Link
                    href="/dashboard/admin/finance/collections"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
                >
                    <CreditCard className="w-4 h-4" />
                    Ir a Cobranza (Stripe)
                </Link>
            </div>
            <StudentList />
        </FadeIn>
    );
}
