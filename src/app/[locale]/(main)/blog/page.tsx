import { useTranslations } from 'next-intl';
import { blogPosts } from '@/lib/blog';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';

export default function BlogPage() {
    const t = useTranslations('Blog');
    const tBlog = useTranslations('BlogData');

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom">
                <FadeIn direction="up">
                    <h1 className="text-center mb-4 text-4xl font-serif font-bold text-slate-900">{t('title')}</h1>
                    <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">{t('subtitle')}</p>
                </FadeIn>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <FadeIn key={post.id} direction="up" delay={0.1 * (index % 3)}>
                            <div className="card group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                                <div className="h-56 bg-slate-200 overflow-hidden relative">
                                    <div
                                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                                        style={{ backgroundImage: `url(${post.image})` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-xs text-accent font-bold mb-3 uppercase tracking-wider">
                                        {post.date}
                                    </div>

                                    <h3 className="text-xl mb-3 font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                                        <Link href={`/blog/${post.id}`}>
                                            {tBlog(`${post.id}.title`)}
                                        </Link>
                                    </h3>

                                    <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                                        {tBlog(`${post.id}.excerpt`)}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <Link href={`/blog/${post.id}`} className="text-primary font-bold text-sm hover:text-accent transition-colors flex items-center gap-1">
                                            {t('readMore')}
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </main>
    );
}
