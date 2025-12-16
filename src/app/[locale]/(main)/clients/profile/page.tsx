import { useTranslations } from 'next-intl';

export default function ClientProfilePage() {
    const t = useTranslations('ClientProfile');

    return (
        <main>
            <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar / Avatar */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4"></div>
                        <h2 className="font-bold text-lg">John Doe</h2>
                        <p className="text-slate-500 text-sm">Student</p>
                        <button className="text-primary text-sm font-medium mt-4 hover:underline">{t('changePhoto')}</button>
                    </div>
                </div>

                {/* Forms */}
                <div className="md:col-span-2 space-y-8">
                    {/* Personal Info */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-6">{t('personalInfo')}</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('firstName')}</label>
                                <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-slate-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('lastName')}</label>
                                <input type="text" defaultValue="Doe" className="w-full px-4 py-2 border border-slate-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
                                <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-2 border border-slate-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('phone')}</label>
                                <input type="tel" defaultValue="+1 234 567 890" className="w-full px-4 py-2 border border-slate-300 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-6">{t('preferences')}</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="text-primary focus:ring-primary" />
                                <span className="text-slate-700 text-sm">{t('emailNotifications')}</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="text-primary focus:ring-primary" />
                                <span className="text-slate-700 text-sm">{t('whatsappNotifications')}</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button className="btn btn-outline">{t('cancel')}</button>
                        <button className="btn btn-primary">{t('saveChanges')}</button>
                    </div>
                </div>
            </div>
        </main>
    );
}
