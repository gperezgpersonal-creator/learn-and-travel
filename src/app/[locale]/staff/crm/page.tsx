import { useTranslations } from 'next-intl';
import { leads } from '@/lib/staff-data';

export default function StaffCRMPage() {
    const t = useTranslations('StaffCRM');

    return (
        <main>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">{t('title')}</h1>
                <button className="btn btn-primary text-sm">{t('addLead')}</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('name')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('program')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('status')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('date')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{lead.name}</div>
                                    <div className="text-xs text-slate-500">{lead.email}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-sm">{lead.program}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                                lead.status === 'qualified' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-green-100 text-green-700'
                                        }`}>
                                        {t(`status.${lead.status}`)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{lead.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:text-accent text-sm font-medium">
                                        {t('view')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
