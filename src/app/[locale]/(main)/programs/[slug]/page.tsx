import { getTranslations } from 'next-intl/server';
import { programs } from '@/lib/programs';
import { MOCK_PROGRAMS } from '@/services/mock/mockData';
import { PROGRAM_TYPES } from '@/lib/programTypes';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';
import ProgramInfoCard from '@/components/ui/ProgramInfoCard';
import Image from 'next/image';
import ProgramTabs from '@/components/programs/ProgramTabs';
import { Star, Shield, Globe, Award, ArrowRight, Users, MapPin, Calendar } from 'lucide-react';

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations('ProgramDetail');
    const tPrograms = await getTranslations('ProgramsData');

    // 0. Check if it's a Program Type (Marketing Page)
    const programType = PROGRAM_TYPES.find(p => p.slug === slug);

    if (programType) {
        // Get translated content
        const tType = await getTranslations(`ProgramTypes.${programType.slug}`);
        const sections = tType.raw('sections') as Record<string, { title: string, content?: string, list?: string[] }>;

        // Extract "What makes it different" (Index 3) for the Benefits Grid
        const benefitsSection = sections['3'];

        return (
            <main className="bg-slate-50 min-h-screen pb-20">
                {/* 1. Immersive Hero Section */}
                <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={programType.heroImage}
                            alt={tType('title')}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900/90"></div>
                    </div>

                    <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white space-y-8">
                            <FadeIn direction="up">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 backdrop-blur-md border border-amber-400/20 text-sm font-medium text-amber-400 mb-6">
                                    <Star className="w-4 h-4 fill-amber-400" />
                                    <span>Premium Excellence</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-white">
                                    {tType('title')}
                                </h1>
                            </FadeIn>
                            <FadeIn direction="up" delay={0.2}>
                                <p className="text-xl md:text-2xl font-light text-slate-200 leading-relaxed max-w-xl">
                                    {tType('description')}
                                </p>
                            </FadeIn>
                            <FadeIn direction="up" delay={0.4}>
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/contact" className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-accent/50 transition-all duration-300">
                                        {t('requestInfo')}
                                    </Link>
                                    <a href="#featured-programs" className="btn bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-8 py-4 cursor-pointer">
                                        {t('explorePrograms')}
                                    </a>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Floating Stats Card */}
                        <FadeIn direction="left" delay={0.6}>
                            <div className="hidden lg:block bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="p-3 bg-accent/20 rounded-xl w-fit">
                                            <Globe className="w-8 h-8 text-accent" />
                                        </div>
                                        <div className="text-3xl font-bold text-white">10+</div>
                                        <div className="text-sm text-slate-300">Destinations</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="p-3 bg-blue-500/20 rounded-xl w-fit">
                                            <Users className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-white">500+</div>
                                        <div className="text-sm text-slate-300">Students/Year</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="p-3 bg-green-500/20 rounded-xl w-fit">
                                            <Shield className="w-8 h-8 text-green-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-white">100%</div>
                                        <div className="text-sm text-slate-300">Safe & Secure</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="p-3 bg-purple-500/20 rounded-xl w-fit">
                                            <Award className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-white">Top</div>
                                        <div className="text-sm text-slate-300">Rated Schools</div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* 2. Benefits Grid (Why Choose Us) */}
                {benefitsSection && benefitsSection.list && (
                    <section className="py-24 bg-white relative overflow-hidden">
                        <div className="container-custom">
                            <FadeIn direction="up">
                                <div className="text-center max-w-3xl mx-auto mb-16">
                                    <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                                        {benefitsSection.title}
                                    </h2>
                                    <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
                                </div>
                            </FadeIn>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {benefitsSection.list.map((item, i) => (
                                    <FadeIn key={i} delay={i * 0.1} direction="up">
                                        <div className="group p-8 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-accent/20 hover:shadow-xl transition-all duration-300 h-full">
                                            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm group-hover:bg-accent group-hover:text-white transition-colors duration-300 w-fit">
                                                {i === 0 ? <Globe className="w-8 h-8" /> :
                                                    i === 1 ? <Users className="w-8 h-8" /> :
                                                        i === 2 ? <Award className="w-8 h-8" /> :
                                                            <Star className="w-8 h-8" />}
                                            </div>
                                            <p className="text-lg text-slate-700 font-medium leading-relaxed">
                                                {item}
                                            </p>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Interactive Content Tabs */}
                <section className="py-24">
                    <div className="container-custom">
                        <ProgramTabs sections={sections} />
                    </div>
                </section>

                {/* 4. Visual Gallery (Masonry) */}
                {programType.images && (
                    <section className="py-24 bg-white">
                        <div className="container-custom">
                            <FadeIn direction="up">
                                <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">Gallery</h2>
                            </FadeIn>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
                                <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
                                    <Image
                                        src={programType.images[0] || programType.heroImage}
                                        alt="Gallery 1"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden group">
                                    <Image
                                        src={programType.images[1] || programType.heroImage}
                                        alt="Gallery 2"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden group">
                                    <Image
                                        src={programType.images[0] || programType.heroImage}
                                        alt="Gallery 3"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="col-span-2 relative rounded-2xl overflow-hidden group">
                                    <Image
                                        src={programType.heroImage}
                                        alt="Gallery 4"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 5. Featured Programs (Keep existing) */}
                <section id="featured-programs" className="py-24 bg-slate-50">
                    <div className="container-custom">
                        <FadeIn direction="up">
                            <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">{t('featuredProgramsTitle') || 'Featured Programs'}</h2>
                        </FadeIn>
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {[1, 2, 3].map((i) => (
                                <FadeIn key={i} delay={i * 0.1} direction="up">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                                        <div className="relative h-48">
                                            <Image
                                                src={i === 1 ? '/images/university-program.jpg' : `https://images.unsplash.com/photo-${i === 2 ? '1517486808906-6ca8b3f04846' : '1543269865-cbf427effbad'}?q=80&w=800&auto=format&fit=crop`}
                                                alt="Program"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {t('available')}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                                                {i === 1 ? 'University' : i === 2 ? 'Educational' : 'Language'}
                                            </div>
                                            <h3 className="text-xl font-bold text-primary mb-2">Summer Experience 2026</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                                <span><MapPin className="w-4 h-4 inline mr-1" /> London, UK</span>
                                                <span><Calendar className="w-4 h-4 inline mr-1" /> 2 Weeks</span>
                                            </div>
                                            <Link href="/programs/summer-experience" className="btn btn-outline w-full text-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary flex items-center justify-center gap-2">
                                                {t('viewDetails')} <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                        <FadeIn direction="up" delay={0.4}>
                            <div className="text-center">
                                <Link href="/programs" className="btn btn-outline px-8 py-3 border-slate-300 text-slate-600 hover:border-primary hover:text-white hover:bg-primary">
                                    {t('morePrograms')}
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="container-custom text-center relative z-10">
                        <FadeIn direction="up">
                            <h2 className="text-4xl font-serif font-bold mb-6 text-white">¿Listo para vivir esta experiencia?</h2>
                            <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
                                Contáctanos para recibir más información, fechas disponibles y costos detallados.
                            </p>
                            <Link href="/contact" className="btn bg-white text-primary hover:bg-slate-100 text-lg px-10 py-5 shadow-xl">
                                {t('requestInfo')}
                            </Link>
                        </FadeIn>
                    </div>
                </section>
            </main>
        );
    }

    // 1. Try to find in CMS data first
    const cmsProgram = MOCK_PROGRAMS.find(p => p.slug === slug);

    // 2. Fallback to static data
    const staticProgram = programs.find(p => p.id === slug);

    if (cmsProgram) {
        // Render CMS Program
        return (
            <main className="bg-slate-50 min-h-screen pb-20">
                {/* Hero */}
                <section className="relative h-[60vh] bg-slate-900 text-white">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1503220317375-aaad6143d41b?auto=format&fit=crop&q=80)` }} // Placeholder image for CMS
                    ></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    <div className="container-custom relative h-full flex flex-col justify-end pb-12">
                        <FadeIn direction="up">
                            <div className="flex gap-4 mb-4">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-wider shadow-sm">CMS Generated</span>
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded text-sm font-medium border border-white/30 capitalize">{cmsProgram.status}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight text-white">{cmsProgram.title}</h1>
                            <p className="text-xl md:text-2xl opacity-90 font-light">{cmsProgram.destination} • {cmsProgram.price.toLocaleString()} {cmsProgram.currency}</p>
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
                                <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                                    {/* CMS doesn't have a separate description field yet, using title as placeholder or we could add one */}
                                    Experience an amazing journey to {cmsProgram.destination}. This program offers a unique opportunity to learn and explore.
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-slate-50 p-4 rounded-lg text-center">
                                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t('location')}</span>
                                        <span className="font-bold text-slate-800">{cmsProgram.destination}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg text-center">
                                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Price</span>
                                        <span className="font-bold text-slate-800">{cmsProgram.price} {cmsProgram.currency}</span>
                                    </div>
                                </div>
                            </section>
                        </FadeIn>

                        {/* Itinerary */}
                        {cmsProgram.itinerary && cmsProgram.itinerary.length > 0 && (
                            <FadeIn direction="up" delay={0.2}>
                                <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                                    <h2 className="text-2xl font-bold mb-8 text-slate-800 border-b border-slate-100 pb-4">{t('itinerary')}</h2>
                                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                        {cmsProgram.itinerary.map((day, index) => (
                                            <div key={day.day} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-slate-500 font-bold z-10">
                                                    {day.day}
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                                    <h3 className="font-bold text-lg mb-2 text-primary">{day.title}</h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{day.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </FadeIn>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Booking Card */}
                        <FadeIn direction="left" delay={0.4}>
                            <div className="bg-white p-8 rounded-xl shadow-lg sticky top-24 border border-slate-100">
                                <div className="mb-6">
                                    <span className="text-sm text-slate-500 block mb-1 font-medium uppercase tracking-wider">{t('priceFrom')}</span>
                                    <div className="text-4xl font-bold text-primary">{cmsProgram.price.toLocaleString()} {cmsProgram.currency}</div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm border-b border-slate-100 pb-3">
                                        <span className="text-slate-500">{t('location')}</span>
                                        <span className="font-medium text-slate-800">{cmsProgram.destination}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">{t('bookNow')}</button>
                                    <button className="btn btn-outline w-full hover:bg-slate-50">{t('requestInfo')}</button>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </main>
        );
    }

    // Fallback to existing static program logic
    const program = staticProgram;

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
