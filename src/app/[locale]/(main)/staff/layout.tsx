import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations('StaffLayout');

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white shadow-sm hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/" className="text-xl font-serif font-bold text-white">
                        L&T Staff
                    </Link>
                    <div className="text-xs text-slate-400 mt-1">Intranet Portal</div>
                </div>

                <nav className="flex-grow p-4 space-y-1">
                    <Link href="/staff" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <span>📊</span> {t('dashboard')}
                    </Link>
                    <Link href="/staff/crm" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <span>👥</span> {t('crm')}
                    </Link>
                    <Link href="/staff/quoter" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <span>💰</span> {t('quoter')}
                    </Link>
                    <Link href="/staff/workflow" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <span>✅</span> {t('workflow')}
                    </Link>
                    <Link href="/staff/cms" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <span>📝</span> {t('cms')}
                    </Link>
                    <Link href="/staff/finance" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <span>💵</span> {t('finance')}
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                        <div className="text-sm">
                            <div className="font-bold">Admin User</div>
                            <div className="text-xs text-slate-400">Manager</div>
                        </div>
                    </div>
                    <button className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 w-full transition-colors text-sm">
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
