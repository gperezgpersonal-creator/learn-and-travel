import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';

export default function IntranetPage() {
    const t = useTranslations('Intranet');

    return (
        <main className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="container-custom max-w-4xl">
                <FadeIn direction="up">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-slate-800 mb-12">
                        {t('title')}
                    </h1>
                </FadeIn>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tec de Monterrey */}
                    <FadeIn direction="up" delay={0.1}>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow h-full flex flex-col">
                            <div className="h-48 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop)' }}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl tracking-wider">TEC</span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('tecTitle')}</h2>
                                <p className="text-slate-500 mb-8 flex-grow">
                                    {t('tecDesc')}
                                </p>
                                <Link href="/tec-de-monterrey" className="btn btn-primary w-full text-center">
                                    {t('access')}
                                </Link>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Administration / Payments */}
                    <FadeIn direction="up" delay={0.2}>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow h-full flex flex-col">
                            <div className="h-48 bg-primary relative">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('adminTitle')}</h2>
                                <p className="text-slate-500 mb-8 flex-grow">
                                    {t('adminDesc')}
                                </p>
                                <Link href="/admin/orders" className="btn btn-outline w-full text-center">
                                    {t('access')}
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </main>
    );
}
