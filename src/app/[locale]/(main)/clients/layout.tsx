import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations('ClientLayout');

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-sm hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/" className="text-xl font-serif font-bold text-primary">
                        Learn and Travel
                    </Link>
                    <div className="text-xs text-slate-400 mt-1">Client Portal</div>
                </div>

                <nav className="flex-grow p-4 space-y-1">
                    <Link href="/clients" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                        <span>📊</span> {t('dashboard')}
                    </Link>
                    <Link href="/clients/trips" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                        <span>✈️</span> {t('myTrips')}
                    </Link>
                    <Link href="/clients/documents" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                        <span>📁</span> {t('documents')}
                    </Link>
                    <Link href="/clients/messages" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                        <span>💬</span> {t('messages')}
                    </Link>
                    <Link href="/clients/payments" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                        <span>💳</span> {t('payments')}
                    </Link>
                    <Link href="/clients/resources" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                        <span>📚</span> {t('resources')}
                    </Link>
                    <Link href="/clients/profile" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                        <span>👤</span> {t('profile')}
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors">
                        <span>🚪</span> {t('logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow md:ml-64 p-8">
                {children}
            </div>
        </div>
    );
}
