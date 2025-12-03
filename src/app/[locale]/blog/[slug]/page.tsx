
import { getTranslations } from 'next-intl/server';
import { blogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations('Blog');
    const tBlog = await getTranslations('BlogData');
    const post = blogPosts.find(p => p.id === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="bg-white min-h-screen pb-20">
            {/* Hero */}
            <section className="relative h-[50vh] bg-slate-900 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${post.image})` }}
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="container-custom relative h-full flex flex-col justify-end pb-12">
                    <FadeIn direction="up">
                        <div className="text-accent font-bold mb-2 uppercase tracking-wider text-sm">{post.date} • {post.author}</div>
                        <h1 className="text-4xl md:text-5xl max-w-4xl font-serif font-bold leading-tight text-white">{tBlog(`${post.id}.title`)}</h1>
                    </FadeIn>
                </div>
            </section>

            <div className="container-custom grid lg:grid-cols-3 gap-12 mt-12">
                {/* Content */}
                <article className="lg:col-span-2 prose prose-lg prose-slate max-w-none">
                    <FadeIn direction="up" delay={0.1}>
                        <div dangerouslySetInnerHTML={{ __html: tBlog(`${post.id}.content`) }} />
                    </FadeIn>
                </article>

                {/* Sidebar */}
                <div className="space-y-8">
                    <FadeIn direction="left" delay={0.2}>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold mb-4 text-lg text-slate-800">{t('relatedPrograms')}</h3>
                            <div className="space-y-4">
                                {/* Placeholder Related Programs */}
                                <div className="flex gap-3 items-center group cursor-pointer hover:bg-white p-2 rounded transition-colors">
                                    <div className="w-16 h-16 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop)' }}></div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-accent font-bold uppercase">Educational</div>
                                        <div className="font-medium text-sm group-hover:text-primary transition-colors">Silicon Valley Tech Tour</div>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center group cursor-pointer hover:bg-white p-2 rounded transition-colors">
                                    <div className="w-16 h-16 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1590089415225-401eb6b9e9e2?q=80&w=2069&auto=format&fit=crop)' }}></div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-accent font-bold uppercase">University</div>
                                        <div className="font-medium text-sm group-hover:text-primary transition-colors">Oxford Summer Academy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.3}>
                        <div className="bg-primary text-white p-8 rounded-xl text-center shadow-lg">
                            <h3 className="text-xl mb-2 font-bold">{t('newsletterTitle')}</h3>
                            <p className="text-white/70 text-sm mb-6">{t('newsletterText')}</p>
                            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded text-slate-800 mb-3 focus:outline-none focus:ring-2 focus:ring-accent" />
                            <button className="btn bg-accent text-primary w-full font-bold hover:bg-white transition-colors">{t('subscribe')}</button>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </main>
    );
}
