import { useTranslations } from 'next-intl';
import { clientPayments } from '@/lib/client-data';

export default function ClientPaymentsPage() {
    const t = useTranslations('ClientPayments');

    return (
        <main>
            <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('concept')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('date')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('amount')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm">{t('status')}</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-sm"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clientPayments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{payment.concept}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{payment.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{payment.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {t(`status.${payment.status}`)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {payment.status === 'pending' && (
                                        <button className="btn btn-primary text-xs py-1 px-3">
                                            {t('payNow')}
                                        </button>
                                    )}
                                    {payment.status === 'paid' && (
                                        <button className="text-primary hover:text-accent text-xs font-medium">
                                            {t('downloadReceipt')}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
