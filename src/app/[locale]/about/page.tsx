import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';
import { Link } from '@/navigation';

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <main>
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2064&auto=format&fit=crop)' }}></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="container-custom relative z-10 text-center">
                    <FadeIn direction="up">
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white">{t('heroTitle')}</h1>
                        <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
                    </FadeIn>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-20 bg-white">
                <div className="container-custom max-w-4xl text-center">
                    <FadeIn direction="up">
                        <h2 className="text-3xl font-bold mb-8 text-slate-800">{t('whoWeAreTitle')}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">{t('whoWeAreText')}</p>
                    </FadeIn>
                </div>
            </section>

            {/* History */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
                    <FadeIn direction="right">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-slate-800">{t('historyTitle')}</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{t('historyText')}</p>
                        </div>
                    </FadeIn>
                    <FadeIn direction="left">
                        <div className="h-96 bg-slate-200 rounded-2xl overflow-hidden shadow-lg relative">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop)' }}></div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <FadeIn direction="up">
                        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">{t('philosophyTitle')}</h2>
                        <p className="text-xl text-center text-slate-600 mb-12 max-w-3xl mx-auto">{t('philosophyIntro')}</p>
                    </FadeIn>

                    <div className="grid md:grid-cols-5 gap-6 mb-12">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <FadeIn key={i} direction="up" delay={0.1 * i}>
                                <div className="bg-slate-50 p-6 rounded-xl h-full border border-slate-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-accent font-bold text-xl mb-3">0{i}</div>
                                    <p className="text-slate-700 font-medium text-sm">{t(`philosophyPoints.${i}`)}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn direction="up" delay={0.6}>
                        <p className="text-center text-lg text-slate-500 italic max-w-2xl mx-auto">"{t('philosophyClosing')}"</p>
                    </FadeIn>
                </div>
            </section>

            {/* Manifesto */}
            <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container-custom max-w-4xl relative z-10">
                    <FadeIn direction="up">
                        <h2 className="text-3xl font-bold mb-8">{t('manifestoTitle')}</h2>
                        <p className="text-lg opacity-90 leading-relaxed whitespace-pre-line font-light">
                            {t('manifestoText')}
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <FadeIn direction="up">
                        <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">{t('teamTitle')}</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <FadeIn key={i} direction="up" delay={0.1 * i}>
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-lg transition-all">
                                    <div className="h-64 bg-slate-200 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(https://i.pravatar.cc/400?img=${i + 10})` }}></div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="font-bold text-xl text-slate-800 mb-1">{t(`teamMembers.${i}.name`)}</h3>
                                        <p className="text-accent text-sm font-bold uppercase tracking-wider mb-4">{t(`teamMembers.${i}.role`)}</p>
                                        <p className="text-slate-500 text-sm italic">"{t(`teamMembers.${i}.quote`)}"</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Methodology */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom">
                    <FadeIn direction="up">
                        <h2 className="text-3xl font-bold mb-16 text-center text-slate-800">{t('methodologyTitle')}</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <FadeIn key={i} direction="up" delay={0.05 * i}>
                                <div className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                                        {i}
                                    </div>
                                    <p className="text-slate-700 font-medium pt-2">{t(`methodologySteps.${i}`)}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="py-20 bg-white">
                <div className="container-custom max-w-4xl text-center">
                    <FadeIn direction="up">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                            🛡️
                        </div>
                        <h2 className="text-3xl font-bold mb-6 text-slate-800">{t('securityTitle')}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">{t('securityText')}</p>
                    </FadeIn>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-slate-900 text-white text-center">
                <div className="container-custom max-w-3xl">
                    <FadeIn direction="up">
                        <p className="text-2xl font-light mb-8 leading-relaxed">{t('ctaText')}</p>
                        <Link href="/programs" className="btn btn-accent text-lg px-8 py-4 inline-block font-bold hover:scale-105 transition-transform">
                            {t('ctaButton')}
                        </Link>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
}
