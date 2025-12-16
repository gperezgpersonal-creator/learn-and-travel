import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function LoginPage() {
    const t = useTranslations('Login');

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-primary p-8 text-center">
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">{t('title')}</h1>
                    <p className="text-slate-300">{t('subtitle')}</p>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        {/* Client Login */}
                        <div className="p-6 border border-slate-200 rounded-lg hover:border-accent transition-colors cursor-pointer group">
                            <h2 className="font-bold text-lg mb-2 text-slate-800 group-hover:text-primary">{t('studentParent')}</h2>
                            <p className="text-sm text-slate-500 mb-4">{t('studentDesc')}</p>
                            <Link href="/clients" className="btn btn-primary w-full text-sm">
                                {t('loginAsClient')}
                            </Link>
                        </div>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">{t('or')}</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* Staff Login */}
                        <div className="p-6 border border-slate-200 rounded-lg hover:border-accent transition-colors cursor-pointer group">
                            <h2 className="font-bold text-lg mb-2 text-slate-800 group-hover:text-primary">{t('staffMember')}</h2>
                            <p className="text-sm text-slate-500 mb-4">{t('staffDesc')}</p>
                            <Link href="/staff" className="btn btn-outline w-full text-sm">
                                {t('loginAsStaff')}
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        {t('noAccount')} <Link href="/register" className="text-primary font-bold hover:underline">{t('register')}</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
