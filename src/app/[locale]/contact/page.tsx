import { useTranslations } from 'next-intl';
import FadeIn from '@/components/ui/FadeIn';

export default function ContactPage() {
    const t = useTranslations('Contact');

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container-custom">
                <FadeIn direction="up">
                    <h1 className="text-center mb-4 text-4xl font-serif font-bold text-slate-900">{t('title')}</h1>
                    <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">{t('subtitle')}</p>
                </FadeIn>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <FadeIn direction="up" delay={0.1}>
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('name')}</label>
                                            <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
                                            <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('interest')}</label>
                                        <select className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                                            <option>{t('interestPrograms')}</option>
                                            <option>{t('interestPartnership')}</option>
                                            <option>{t('interestGeneral')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('message')}</label>
                                        <textarea rows={5} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full md:w-auto">
                                        {t('submit')}
                                    </button>
                                </form>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        <FadeIn direction="up" delay={0.2}>
                            <div className="bg-primary text-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-xl mb-6 font-bold">{t('contactInfo')}</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-accent text-xs font-bold uppercase mb-1">{t('emailLabel')}</div>
                                        <p className="text-lg">contacto@ariagui.com</p>
                                    </div>
                                    <div>
                                        <div className="text-accent text-xs font-bold uppercase mb-1">{t('addressLabel')}</div>
                                        <div className="space-y-4">
                                            <p className="leading-relaxed">{t('miamiAddress')}</p>
                                            <p className="leading-relaxed">{t('mexicoAddress')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </main>
    );
}
