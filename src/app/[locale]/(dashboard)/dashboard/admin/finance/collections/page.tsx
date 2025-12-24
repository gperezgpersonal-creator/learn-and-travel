'use client';

import { useState } from 'react';
import FadeIn from '@/components/ui/FadeIn';
import { Link } from '@/navigation';
import { ArrowLeft } from 'lucide-react';
import PaymentInbox from './components/PaymentInbox';
import StudentList from './components/StudentList';

export default function CollectionsPage() {
    const [activeTab, setActiveTab] = useState<'inbox' | 'students'>('inbox');

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard/admin/finance?tab=cobranza" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-slate-900">Cobranza (Collections)</h1>
                        <p className="text-slate-500 text-sm">Conciliación de pagos y control de adeudos.</p>
                    </div>
                </div>

                <div className="flex border-b border-slate-200 mb-8">
                    <button
                        onClick={() => setActiveTab('inbox')}
                        className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'inbox' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Buzón de Pagos (Stripe)
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'students' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Directorio de Alumnos
                    </button>
                </div>

                {activeTab === 'inbox' && <PaymentInbox />}
                {activeTab === 'students' && <StudentList />}
            </FadeIn>
        </div>
    );
}
