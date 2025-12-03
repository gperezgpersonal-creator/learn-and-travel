import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ClientDashboardPage() {
    const t = useTranslations('ClientDashboard');

    return (
        <main>
            <h1 className="text-2xl font-bold mb-8">{t('welcome')}, Student!</h1>

            {/* My Trips Summary */}
            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4">{t('myTrips')}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-2">{t('upcoming')}</div>
                        <h3 className="font-bold text-lg mb-1">Silicon Valley Tech Tour</h3>
                        <p className="text-sm text-slate-500 mb-4">Jul 15 - Jul 25, 2026</p>
                        <Link href="/clients/trips/1" className="text-primary text-sm font-medium hover:underline">
                            {t('viewDetails')}
                        </Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-slate-200 opacity-60">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-2">{t('completed')}</div>
                        <h3 className="font-bold text-lg mb-1">London Cultural Trip</h3>
                        <p className="text-sm text-slate-500 mb-4">Aug 2024</p>
                        <Link href="/clients/trips/2" className="text-primary text-sm font-medium hover:underline">
                            {t('viewDetails')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Access */}
            <section>
                <h2 className="text-lg font-bold mb-4">{t('quickAccess')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Link href="/clients/documents" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                        <div className="text-3xl mb-2">📄</div>
                        <div className="font-medium">{t('documents')}</div>
                    </Link>
                    <Link href="/clients/messages" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                        <div className="text-3xl mb-2">💬</div>
                        <div className="font-medium">{t('messages')}</div>
                        <div className="text-xs text-red-500 mt-1">2 {t('new')}</div>
                    </Link>
                    <Link href="/clients/payments" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                        <div className="text-3xl mb-2">💳</div>
                        <div className="font-medium">{t('payments')}</div>
                    </Link>
                    <Link href="/clients/resources" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="font-medium">{t('resources')}</div>
                    </Link>
                </div>
            </section>
        </main>
    );
}
