import { useTranslations } from 'next-intl';
import { clientTrips } from '@/lib/client-data';
import Link from 'next/link';

export default async function ClientTripDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await useTranslations('ClientTrips');
    const trip = clientTrips.find(t => t.id === id);

    if (!trip) {
        return <div>Trip not found</div>;
    }

    return (
        <main>
            {/* Hero Section */}
            <div className="relative h-64 rounded-xl overflow-hidden mb-8">
                <div className="absolute inset-0 bg-slate-900/50"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center -z-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                    <Link href="/clients/trips" className="text-sm text-slate-300 hover:text-white mb-4 flex items-center gap-2">
                        ← {t('backToTrips')}
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
                    <div className="flex gap-4 text-sm">
                        <span>📍 {trip.destination}</span>
                        <span>📅 {trip.dates}</span>
                    </div>
                </div>
            </div>

            {/* Trip Resources */}
            <h2 className="text-xl font-bold mb-6">{t('tripResources')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-3xl mb-4">📅</div>
                    <h3 className="font-bold mb-2">Itinerary</h3>
                    <p className="text-sm text-slate-500">Daily schedule and activities</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-3xl mb-4">✈️</div>
                    <h3 className="font-bold mb-2">Flight Info</h3>
                    <p className="text-sm text-slate-500">Tickets and boarding passes</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-3xl mb-4">🏨</div>
                    <h3 className="font-bold mb-2">Accommodation</h3>
                    <p className="text-sm text-slate-500">Hotel details and room info</p>
                </div>
            </div>
        </main>
    );
}
