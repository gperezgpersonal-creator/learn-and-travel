import { useTranslations } from 'next-intl';
import { financeRecords } from '@/lib/staff-data';

export default function StaffFinancePage() {
    const t = useTranslations('StaffFinance');

    return (
        <main>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">{t('title')}</h1>
                <div className="flex gap-2">
                    <button className="btn btn-outline text-sm">{t('exportReport')}</button>
                    <button className="btn btn-primary text-sm">{t('newTransaction')}</button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('description')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('category')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('date')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('amount')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {financeRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{record.description}</td>
                                <td className="px-6 py-4 text-slate-600 text-sm">{record.category}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{record.date}</td>
                                <td className={`px-6 py-4 font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {record.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${record.status === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {t(`status.${record.status}`)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
