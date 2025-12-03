import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';

export default function HomePage() {
    const t = useTranslations('Home');

    return (
        <main>
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                        alt="Students traveling"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="container-custom relative z-10 text-center text-white">
                    <FadeIn direction="up">
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white">
                            {t('heroTitle')}
                        </h1>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2}>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light text-slate-100">
                            {t('heroSubtitle')}
                        </p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.4}>
                        <Link href="/programs" className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                            {t('heroButton')}
                        </Link>
                    </FadeIn>
                </div>
            </section>

            {/* What is Learn and Travel */}
            <section className="py-20 bg-white">
                <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
                    <FadeIn direction="right">
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=2070&auto=format&fit=crop"
                                alt="Students collaborating"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </FadeIn>
                    <FadeIn direction="left" delay={0.2}>
                        <div>
                            <h2 className="text-4xl font-serif font-bold text-primary mb-6">{t('whatIsTitle')}</h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                {t('whatIsText1')}
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('whatIsText2')}
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom">
                    <FadeIn direction="up">
                        <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">{t('benefitsTitle')}</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <FadeIn key={item} delay={index * 0.1} direction="up">
                                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full">
                                    <div className="text-4xl mb-4 text-accent">
                                        {['✨', '🌍', '👥', '🏢', '📚', '🤝'][index]}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800">{t(`benefit${item}`)}</h3>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program Types */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <FadeIn direction="up">
                        <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">{t('programTypesTitle')}</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { id: 1, img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop' },
                            { id: 2, img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop' },
                            { id: 3, img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2070&auto=format&fit=crop' },
                            { id: 4, img: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop' },
                            { id: 5, img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop' },
                            { id: 6, img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2070&auto=format&fit=crop' }
                        ].map((program, index) => (
                            <FadeIn key={program.id} delay={index * 0.1} direction="up">
                                <div className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/5] cursor-pointer">
                                    <Image
                                        src={program.img}
                                        alt={t(`programType${program.id}Title`)}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                                        <h3 className="text-2xl font-bold mb-2 text-white">{t(`programType${program.id}Title`)}</h3>
                                        <p className="text-slate-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            {t(`programType${program.id}Desc`)}
                                        </p>
                                        <span className="text-accent text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            {t('viewMore')} →
                                        </span>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-16 bg-slate-900 text-white overflow-hidden">
                <div className="container-custom text-center">
                    <FadeIn direction="up">
                        <h2 className="text-2xl font-serif font-bold mb-12 opacity-80 text-white">{t('partnersTitle')}</h2>
                    </FadeIn>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos - In production these would be SVGs */}
                        {['Harvard', 'MIT', 'Oxford', 'Stanford', 'Cambridge'].map((partner, index) => (
                            <FadeIn key={partner} delay={index * 0.1} direction="up">
                                <span className="text-2xl font-bold">{partner}</span>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Programs (Quick List) */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom">
                    <div className="flex justify-between items-end mb-12">
                        <FadeIn direction="right">
                            <h2 className="text-4xl font-serif font-bold text-primary">{t('featuredProgramsTitle')}</h2>
                        </FadeIn>
                        <FadeIn direction="left">
                            <Link href="/programs" className="text-primary font-bold hover:text-accent transition-colors">
                                {t('viewMore')} →
                            </Link>
                        </FadeIn>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <FadeIn key={i} delay={i * 0.1} direction="up">
                                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                                    <div className="relative h-48">
                                        <Image
                                            src={`https://images.unsplash.com/photo-${i === 1 ? '1523050854058-8df90110c9f1' : i === 2 ? '1517486808906-6ca8b3f04846' : '1543269865-cbf427effbad'}?q=80&w=800&auto=format&fit=crop`}
                                            alt="Program"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full">
                                            {t('available')}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                                            {i === 1 ? 'University' : i === 2 ? 'Educational' : 'Language'}
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-2">Summer Experience 2024</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                            <span>📍 London, UK</span>
                                            <span>📅 2 Weeks</span>
                                        </div>
                                        <Link href="/programs/summer-experience" className="btn btn-outline w-full text-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                                            {t('viewDetails')}
                                        </Link>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Preview */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <FadeIn direction="up">
                        <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">{t('blogTitle')}</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 gap-12">
                        <FadeIn direction="right">
                            <div className="group cursor-pointer">
                                <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                                    <Image
                                        src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=2070&auto=format&fit=crop"
                                        alt="Blog 1"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                    <span>Oct 24, 2024</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>Tips</span>
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                                    Top 10 skills you learn while traveling abroad
                                </h3>
                                <p className="text-slate-600 mb-4 line-clamp-2">
                                    Discover how educational travel shapes your character and professional future in ways you never imagined.
                                </p>
                                <Link href="/blog/top-skills" className="text-primary font-bold hover:underline">
                                    {t('readMore')} →
                                </Link>
                            </div>
                        </FadeIn>
                        <FadeIn direction="left" delay={0.2}>
                            <div className="group cursor-pointer">
                                <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                                    <Image
                                        src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop"
                                        alt="Blog 2"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                    <span>Oct 18, 2024</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>Guides</span>
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                                    How to prepare for your first international internship
                                </h3>
                                <p className="text-slate-600 mb-4 line-clamp-2">
                                    Everything you need to know before embarking on your professional journey in a new country.
                                </p>
                                <Link href="/blog/internship-prep" className="text-primary font-bold hover:underline">
                                    {t('readMore')} →
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </main>
    );
}
