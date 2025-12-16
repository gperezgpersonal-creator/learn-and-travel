
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { blogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';
import { ChevronRight, Calendar, User, Share2, Facebook, Twitter, Linkedin, Clock } from 'lucide-react';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'Blog' });
    const tBlog = await getTranslations({ locale, namespace: 'BlogData' });
    const post = blogPosts.find(p => p.id === slug);

    if (!post) {
        notFound();
    }

    let postTitle = post.title;
    let postContent = post.content;

    try {
        const tTitle = tBlog(`${post.id}.title`);
        const tContent = tBlog(`${post.id}.content`);

        // Check if translation exists (next-intl returns key if missing)
        // If next-intl returns the key path (e.g., BlogData.id.content), it means lookup failed.
        // We use the fallback content from blog.ts.
        if (tTitle && !tTitle.includes('BlogData.')) {
            postTitle = tTitle;
        }

        if (tContent && !tContent.includes('BlogData.')) {
            postContent = tContent;
        } else {
            // Fallback strategy for large content that fails to load from JSON
            if (locale === 'es' && post.contentEs) {
                postContent = post.contentEs;
            } else {
                postContent = post.content;
            }
        }
    } catch (error) {
        console.error(`Failed to translate blog post ${post.id}:`, error);
        // Fallback to post.title/content from blog.ts is already set
    }

    return (
        <main className="bg-slate-50 min-h-screen pb-20">
            {/* Breadcrumbs & Hero */}
            <section className="relative h-[60vh] bg-slate-900 text-white group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30"></div>

                <div className="container-custom relative h-full flex flex-col justify-end pb-16">
                    <FadeIn direction="up">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
                            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white truncate max-w-[200px] md:max-w-xs">{postTitle}</span>
                        </div>

                        {/* Title & Metadata */}
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium tracking-wide">
                                <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    Travel Tips
                                </span>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <User className="w-4 h-4 text-accent" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span>5 min read</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-white mb-6 drop-shadow-sm">
                                {postTitle}
                            </h1>
                        </div>
                    </FadeIn>
                </div>
            </section>

            <div className="container-custom grid lg:grid-cols-12 gap-12 -mt-10 relative z-10">
                {/* Main Content (8 cols) */}
                <article className="lg:col-span-8 bg-white p-8 md:p-12 rounded-2xl shadow-xl shadow-slate-200/50">
                    <FadeIn direction="up" delay={0.1}>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#1877F2] hover:text-white transition-colors duration-300">
                                    <Facebook className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#1DA1F2] hover:text-white transition-colors duration-300">
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#0A66C2] hover:text-white transition-colors duration-300">
                                    <Linkedin className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-colors duration-300">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-slate-400 text-sm italic hidden sm:block">
                                Share this post
                            </div>
                        </div>

                        <div
                            className="prose prose-slate max-w-none 
                                prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-10 prose-headings:mb-4
                                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                                prose-li:text-slate-600 prose-li:marker:text-accent prose-li:my-2 prose-li:leading-relaxed
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline 
                                prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-slate-50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:text-slate-700 prose-blockquote:text-lg prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:rounded-r-lg
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8"
                            dangerouslySetInnerHTML={{ __html: postContent }}
                        />

                        <div className="mt-12 pt-8 border-t border-slate-100 text-slate-500 italic text-sm text-center">
                            Published in Education & Travel
                        </div>
                    </FadeIn>
                </article>

                {/* Sidebar (4 cols) */}
                <aside className="lg:col-span-4 space-y-8 pt-2">
                    {/* Newsletter Widget */}
                    <FadeIn direction="left" delay={0.2}>
                        <div className="bg-primary p-8 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>

                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{t('newsletterTitle')}</h3>
                            <p className="text-white/80 text-sm mb-6 relative z-10">{t('newsletterText')}</p>

                            <form className="space-y-3 relative z-10">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                                />
                                <button className="w-full btn bg-accent text-white font-bold py-3 rounded-lg hover:bg-white hover:text-primary transition-all shadow-md hover:shadow-xl">
                                    {t('subscribe')}
                                </button>
                            </form>
                        </div>
                    </FadeIn>

                    {/* Related Programs Widget */}
                    <FadeIn direction="left" delay={0.3}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-800">{t('relatedPrograms')}</h3>
                                <Link href="/programs" className="text-xs font-bold text-primary hover:text-accent uppercase tracking-wider">View All</Link>
                            </div>

                            <div className="space-y-4">
                                <Link href="/programs/silicon-valley" className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                        <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop)' }}></div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">Educational</span>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-primary transition-colors">Silicon Valley Tech Tour</h4>
                                    </div>
                                </Link>

                                <Link href="/programs/oxford-academy" className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                        <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1590089415225-401eb6b9e9e2?q=80&w=2069&auto=format&fit=crop)' }}></div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">University</span>
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-primary transition-colors">Oxford Summer Academy</h4>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </aside>
            </div>
        </main>
    );
}
