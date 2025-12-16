import { useTranslations } from 'next-intl';
import { clientTrips } from '@/lib/client-data';

export default function ClientDocumentsPage() {
    const t = useTranslations('ClientDocuments');

    return (
        <main>
            <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

            <div className="space-y-8">
                {clientTrips.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">{trip.title}</h3>
                            <span className="text-xs text-slate-500">{trip.dates}</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {trip.documents.map((doc) => (
                                <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded flex items-center justify-center text-lg ${doc.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {doc.type === 'pdf' ? 'PDF' : 'IMG'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-800">{doc.name}</div>
                                            <div className="text-xs text-slate-500">{doc.date !== '-' ? `${t('uploadedOn')} ${doc.date}` : t('pendingUpload')}</div>
                                        </div>
                                    </div>

                                    <div>
                                        {doc.status === 'uploaded' ? (
                                            <button className="text-primary hover:text-accent text-sm font-medium">
                                                {t('download')}
                                            </button>
                                        ) : (
                                            <button className="btn btn-outline text-xs py-1 px-3">
                                                {t('upload')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
