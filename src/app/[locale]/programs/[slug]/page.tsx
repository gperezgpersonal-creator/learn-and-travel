import { getTranslations } from 'next-intl/server';
import { programs } from '@/lib/programs';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';
import ProgramInfoCard from '@/components/ui/ProgramInfoCard';

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations('ProgramDetail');
    const tPrograms = await getTranslations('ProgramsData');
    const program = programs.find(p => p.id === slug);

    if (!program) {
        notFound();
    }

    return (
        <main className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <section className="relative h-[60vh] bg-slate-900 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${program.image})` }}
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="container-custom relative h-full flex flex-col justify-end pb-12">
                    <FadeIn direction="up">
                        <div className="flex gap-4 mb-4">
                            <span className="bg-accent text-primary px-3 py-1 rounded text-sm font-bold uppercase tracking-wider shadow-sm">{program.type}</span>
                            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded text-sm font-medium border border-white/30">{program.status}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight text-white">{tPrograms(`${program.id}.title`)}</h1>
                        <p className="text-xl md:text-2xl opacity-90 font-light">{program.city}, {program.country} • {program.dates}</p>
                    </FadeIn>
                </div>
            </section>

            <div className="container-custom grid lg:grid-cols-3 gap-12 -mt-8 relative z-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Summary */}
                    <FadeIn direction="up" delay={0.1}>
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">{t('overview')}</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 text-lg">{tPrograms(`${program.id}.description`)}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-slate-50 p-4 rounded-lg text-center">
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('ageGroup')}</span>
                                    <span className="font-bold text-slate-800">{program.ageGroup}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg text-center">
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('duration')}</span>
                                    <span className="font-bold text-slate-800">10 Days</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg text-center">
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('location')}</span>
                                    <span className="font-bold text-slate-800">{program.city}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg text-center">
                                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('dates')}</span>
                                    <span className="font-bold text-slate-800 text-sm">{program.dates.split(' - ')[0]}</span>
                                </div>
                            </div>
                        </section>
                    </FadeIn>

                    {/* Example Info Card Module */}
                    <FadeIn direction="up" delay={0.15}>
                        <ProgramInfoCard />
                    </FadeIn>

                    {/* Itinerary */}
                    {program.itinerary && (
                        <FadeIn direction="up" delay={0.2}>
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold mb-8 text-slate-800 border-b border-slate-100 pb-4">{t('itinerary')}</h2>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                    {program.itinerary.map((day, index) => (
                                        <div key={day.day} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-slate-500 font-bold z-10">
                                                {day.day}
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                                <h3 className="font-bold text-lg mb-2 text-primary">{tPrograms(`${program.id}.itinerary.${index + 1}.title`)}</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed">{tPrograms(`${program.id}.itinerary.${index + 1}.description`)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </FadeIn>
                    )}

                    {/* Inclusions */}
                    <FadeIn direction="up" delay={0.3}>
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">{t('included')}</h2>
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="font-bold mb-4 text-green-600 flex items-center gap-2">
                                        <span className="bg-green-100 p-1 rounded-full text-xs">✓</span> {t('whatsIncluded')}
                                    </h3>
                                    <ul className="space-y-3">
                                        {program.inclusions?.map((_, i) => (
                                            <li key={i} className="flex gap-3 items-start text-slate-600 text-sm">
                                                <span className="text-green-500 mt-0.5">✓</span>
                                                {tPrograms(`${program.id}.inclusions.${i}`)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-4 text-red-500 flex items-center gap-2">
                                        <span className="bg-red-100 p-1 rounded-full text-xs">✕</span> {t('whatsNotIncluded')}
                                    </h3>
                                    <ul className="space-y-3">
                                        {program.exclusions?.map((_, i) => (
                                            <li key={i} className="flex gap-3 items-start text-slate-600 text-sm">
                                                <span className="text-red-400 mt-0.5">✕</span>
                                                {tPrograms(`${program.id}.exclusions.${i}`)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </FadeIn>

                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Booking Card */}
                    <FadeIn direction="left" delay={0.4}>
                        <div className="bg-white p-8 rounded-xl shadow-lg sticky top-24 border border-slate-100">
                            <div className="mb-6">
                                <span className="text-sm text-slate-500 block mb-1 font-medium uppercase tracking-wider">{t('priceFrom')}</span>
                                <div className="text-4xl font-bold text-primary">{program.price || '$TBD'}</div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm border-b border-slate-100 pb-3">
                                    <span className="text-slate-500">{t('dates')}</span>
                                    <span className="font-medium text-slate-800">{program.dates}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-slate-100 pb-3">
                                    <span className="text-slate-500">{t('location')}</span>
                                    <span className="font-medium text-slate-800">{program.city}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">{t('bookNow')}</button>
                                <button className="btn btn-outline w-full hover:bg-slate-50">{t('requestInfo')}</button>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                {t('securePayment')}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Documents Placeholder */}
                    <FadeIn direction="left" delay={0.5}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold mb-4 text-slate-800">{t('downloads')}</h3>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-white hover:shadow-md transition-all group">
                                <span className="text-2xl group-hover:scale-110 transition-transform">📄</span>
                                <div className="text-sm">
                                    <div className="font-bold text-slate-700 group-hover:text-primary transition-colors">Program Brochure</div>
                                    <div className="text-slate-400 text-xs">PDF • 2.4 MB</div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </main>
    );
}
