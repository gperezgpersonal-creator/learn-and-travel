import { useTranslations } from 'next-intl';
import { clientResources } from '@/lib/client-data';

export default function ClientResourcesPage() {
    const t = useTranslations('ClientResources');

    return (
        <main>
            <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientResources.map((resource) => (
                    <div key={resource.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${resource.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                    resource.type === 'checklist' ? 'bg-green-100 text-green-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {resource.type === 'pdf' ? '📄' : resource.type === 'checklist' ? '✅' : '🔗'}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">{resource.type}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                        <p className="text-slate-500 text-sm mb-4">{resource.description}</p>

                        <div className="text-primary font-medium text-sm group-hover:underline">
                            {t('access')} →
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
