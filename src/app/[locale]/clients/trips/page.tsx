import { useTranslations } from 'next-intl';
import { clientTrips } from '@/lib/client-data';
import Link from 'next/link';

export default function ClientTripsPage() {
    const t = useTranslations('ClientTrips');

    return (
        <main>
            <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

            <div className="space-y-6">
                {clientTrips.map((trip) => (
                    <div key={trip.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-32 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${trip.image})` }}
                            ></div>
                        </div>

                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">{trip.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${trip.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                                        trip.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {t(`status.${trip.status}`)}
                                </span>
                            </div>

                            <p className="text-slate-600 mb-1">{trip.destination}</p>
                            <p className="text-slate-500 text-sm mb-4">{trip.dates}</p>

                            <div className="flex gap-4">
                                <Link href={`/clients/trips/${trip.id}`} className="btn btn-primary text-sm py-2">
                                    {t('viewDetails')}
                                </Link>
                                <Link href={`/clients/documents`} className="btn btn-outline text-sm py-2">
                                    {t('documents')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
