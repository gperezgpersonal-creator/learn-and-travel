import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';

export default function Footer() {
    const t = useTranslations('Footer');
    const nav = useTranslations('Navigation');

    return (
        <footer className="bg-slate-900 text-white py-16">
            <div className="container-custom">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <FadeIn direction="up">
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="text-2xl font-serif font-bold text-white mb-6 block">
                                Learn and Travel
                            </Link>
                            <p className="text-slate-400 mb-6 max-w-sm">
                                {t('company')}
                            </p>
                            <div className="space-y-2 text-slate-400 text-sm">
                                <p>{t('contact')}</p>
                                <p>{t('miamiAddress')}</p>
                                <p>{t('mexicoAddress')}</p>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Links */}
                    <FadeIn direction="up" delay={0.1}>
                        <div>
                            <h4 className="font-bold text-lg mb-6 text-accent">Links</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li><Link href="/about" className="hover:text-white transition-colors">{nav('about')}</Link></li>
                                <li><Link href="/programs" className="hover:text-white transition-colors">{nav('programs')}</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">{nav('blog')}</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">{nav('contact')}</Link></li>
                            </ul>
                        </div>
                    </FadeIn>

                    {/* Legal */}
                    <FadeIn direction="up" delay={0.2}>
                        <div>
                            <h4 className="font-bold text-lg mb-6 text-accent">Legal</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
                                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">{t('terms')}</Link></li>
                            </ul>
                        </div>
                    </FadeIn>
                </div>

                <FadeIn direction="up" delay={0.3}>
                    <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} Learn and Travel. {t('rights')}</p>
                    </div>
                </FadeIn>
            </div>
        </footer>
    );
}
