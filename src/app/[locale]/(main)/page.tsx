import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PhotoCollage from '@/components/home/PhotoCollage';
import { blogPosts } from '@/lib/blog';

export default function HomePage() {
    const t = useTranslations('Home');
    const tBlog = useTranslations('BlogData');

    return (
        <main>
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero-bg.jpg"
                        alt="Students traveling"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="container-custom relative z-10 text-center text-white">
                    <FadeIn direction="up">
                        <h1 className="text-3xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white">
                            {t('heroTitle')}
                        </h1>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2}>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light text-slate-100">
                            {t('heroSubtitle')}
                        </p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.4}>
                        <Link href="/contact" className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                            Conoce nuestros programas
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
                                src="/images/students-learning.jpg"
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

            <WhyChooseUs />

            {/* Partners */}
            <section className="py-16 bg-slate-900 text-white overflow-hidden">
                <div className="container-custom text-center">
                    <FadeIn direction="up">
                        <h2 className="text-2xl font-serif font-bold mb-12 opacity-80 text-white">{t('partnersTitle')}</h2>
                    </FadeIn>
                    <div className="relative w-full h-auto bg-white/5 rounded-xl p-8 backdrop-blur-sm">
                        <FadeIn direction="up" delay={0.2}>
                            <Image
                                src="/images/partners-banner.png"
                                alt="Partners"
                                width={1200}
                                height={400}
                                className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-500"
                            />
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Our Partners */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom text-center">
                    <FadeIn direction="up">
                        <h2 className="text-4xl font-serif font-bold text-primary mb-12">{t('ourPartnersTitle')}</h2>
                    </FadeIn>
                    <div className="relative w-full h-auto bg-white rounded-xl p-8 shadow-sm">
                        <FadeIn direction="up" delay={0.2}>
                            <Image
                                src="/images/our-partners.png"
                                alt="Our Partners"
                                width={1200}
                                height={400}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                            />
                        </FadeIn>
                    </div>
                </div>
            </section>

            <PhotoCollage />

            {/* Blog Preview */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <FadeIn direction="up">
                        <h2 className="text-4xl font-serif font-bold text-primary mb-12 text-center">{t('blogTitle')}</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <FadeIn key={post.id} delay={index * 0.1} direction="up">
                                <Link href={`/blog/${post.id}`} className="group block bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                    <div className="relative h-48 bg-slate-200">
                                        <Image
                                            src={post.image}
                                            alt={tBlog(`${post.id}.title`)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">
                                            {tBlog(`${post.id}.date`)}
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
                                            {tBlog(`${post.id}.title`)}
                                        </h3>
                                        <p className="text-slate-600 mb-4 line-clamp-3 flex-grow">
                                            {tBlog(`${post.id}.excerpt`)}
                                        </p>
                                        <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                                            {t('readMore')}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
