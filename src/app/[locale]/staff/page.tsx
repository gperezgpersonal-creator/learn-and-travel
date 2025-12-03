import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function StaffDashboardPage() {
    const t = useTranslations('StaffDashboard');

    return (
        <main>
            <h1 className="text-2xl font-bold mb-8 text-slate-800">{t('title')}</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-slate-500 text-sm font-medium uppercase mb-2">{t('activeLeads')}</div>
                    <div className="text-3xl font-bold text-slate-800">24</div>
                    <div className="text-green-500 text-xs mt-1">↑ 12% {t('vsLastMonth')}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-slate-500 text-sm font-medium uppercase mb-2">{t('pendingQuotes')}</div>
                    <div className="text-3xl font-bold text-slate-800">8</div>
                    <div className="text-slate-400 text-xs mt-1">{t('needsAction')}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-slate-500 text-sm font-medium uppercase mb-2">{t('activeTrips')}</div>
                    <div className="text-3xl font-bold text-slate-800">3</div>
                    <div className="text-blue-500 text-xs mt-1">{t('studentsTraveling')}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-slate-500 text-sm font-medium uppercase mb-2">{t('revenue')}</div>
                    <div className="text-3xl font-bold text-slate-800">$45k</div>
                    <div className="text-green-500 text-xs mt-1">↑ 5% {t('vsLastMonth')}</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-bold text-lg mb-4">{t('recentActivity')}</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">Lead</div>
                            <div>
                                <div className="text-sm font-medium">New lead: Maria Garcia</div>
                                <div className="text-xs text-slate-500">Interested in Oxford Summer Academy</div>
                            </div>
                            <div className="ml-auto text-xs text-slate-400">2h ago</div>
                        </div>
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">Pay</div>
                            <div>
                                <div className="text-sm font-medium">Payment received: $1,500</div>
                                <div className="text-xs text-slate-500">John Doe - Silicon Valley Tour</div>
                            </div>
                            <div className="ml-auto text-xs text-slate-400">5h ago</div>
                        </div>
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">Task</div>
                            <div>
                                <div className="text-sm font-medium">Quote approved #Q-1023</div>
                                <div className="text-xs text-slate-500">Ready for invoicing</div>
                            </div>
                            <div className="ml-auto text-xs text-slate-400">1d ago</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-bold text-lg mb-4">{t('quickActions')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/staff/crm" className="p-4 border border-slate-200 rounded hover:border-primary hover:bg-slate-50 transition-colors text-center">
                            <div className="text-2xl mb-2">➕</div>
                            <div className="font-medium text-sm">{t('newLead')}</div>
                        </Link>
                        <Link href="/staff/quoter" className="p-4 border border-slate-200 rounded hover:border-primary hover:bg-slate-50 transition-colors text-center">
                            <div className="text-2xl mb-2">📝</div>
                            <div className="font-medium text-sm">{t('createQuote')}</div>
                        </Link>
                        <Link href="/staff/cms" className="p-4 border border-slate-200 rounded hover:border-primary hover:bg-slate-50 transition-colors text-center">
                            <div className="text-2xl mb-2">📰</div>
                            <div className="font-medium text-sm">{t('newPost')}</div>
                        </Link>
                        <Link href="/staff/finance" className="p-4 border border-slate-200 rounded hover:border-primary hover:bg-slate-50 transition-colors text-center">
                            <div className="text-2xl mb-2">🧾</div>
                            <div className="font-medium text-sm">{t('recordPayment')}</div>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
