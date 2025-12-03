import { useTranslations } from 'next-intl';
import { quotes } from '@/lib/staff-data';

export default function StaffQuoterPage() {
    const t = useTranslations('StaffQuoter');

    return (
        <main>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">{t('title')}</h1>
                <button className="btn btn-primary text-sm">{t('createQuote')}</button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Quotes List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700">
                        {t('recentQuotes')}
                    </div>
                    <div className="divide-y divide-slate-100">
                        {quotes.map((quote) => (
                            <div key={quote.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <div className="font-bold text-slate-900">{quote.client}</div>
                                    <div className="text-sm text-slate-500">{quote.program}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">{quote.amount}</div>
                                    <span className={`text-xs font-bold uppercase ${quote.status === 'approved' ? 'text-green-600' :
                                            quote.status === 'sent' ? 'text-blue-600' :
                                                quote.status === 'rejected' ? 'text-red-600' :
                                                    'text-slate-500'
                                        }`}>
                                        {t(`status.${quote.status}`)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Quote Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                    <h2 className="font-bold text-lg mb-4">{t('quickQuote')}</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('clientName')}</label>
                            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('program')}</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded text-sm">
                                <option>Select Program...</option>
                                <option>Silicon Valley Tech Tour</option>
                                <option>Oxford Summer Academy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('participants')}</label>
                            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded text-sm" />
                        </div>
                        <button type="button" className="btn btn-outline w-full text-sm">
                            {t('calculate')}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
