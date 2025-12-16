import { useTranslations } from 'next-intl';
import { workflowItems } from '@/lib/staff-data';

export default function StaffWorkflowPage() {
    const t = useTranslations('StaffWorkflow');

    return (
        <main>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">{t('title')}</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflowItems.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {t(`status.${item.status}`)}
                            </span>
                            <span className="text-xs text-slate-400">{item.date}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{t('requestedBy')}: {item.requester}</p>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <div className="font-bold text-slate-800">{item.amount}</div>
                            {item.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button className="text-green-600 hover:bg-green-50 p-1 rounded">✓</button>
                                    <button className="text-red-600 hover:bg-red-50 p-1 rounded">✕</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
