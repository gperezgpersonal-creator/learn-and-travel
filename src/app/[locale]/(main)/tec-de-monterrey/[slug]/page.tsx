import { tecPrograms } from '@/data/programs';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/navigation';
import ReserveButton from '@/components/cart/ReserveButton';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import OrlandoLanding from '@/components/programs/OrlandoLanding';

export default async function ProgramDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const program = tecPrograms.find((p) => p.slug === params.slug);

    if (!program) {
        notFound();
    }

    // Special Program Render
    if (program.slug === 'orlando-business-2026') {
        return <OrlandoLanding program={program} />;
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Navigation Back */}
            <div className="bg-slate-900 text-white py-4">
                <div className="container-custom">
                    <Link href="/tec-de-monterrey" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Portal Tec
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-end">
                <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="container-custom relative z-10 pb-16 text-white">
                    <div className="max-w-4xl">
                        <span className="inline-block bg-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                            Exclusivo Tec
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif leading-tight">
                            {program.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-sm font-medium opacity-90">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> {program.location}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-5 h-5" /> {program.duration}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" /> {program.date}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content & Booking */}
            <div className="container-custom -mt-10 relative z-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Descripción del Programa</h2>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                            <p className="text-lg mb-6 font-medium">{program.description}</p>
                            <p>{program.fullDescription}</p>
                            <p className="mt-6">
                                Este programa académico está diseñado para estudiantes de alto rendimiento que buscan expandir sus horizontes
                                profesionales a través de una inmersión cultural y académica rigurosa.
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Lo que incluye:</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Alojamiento en residencias estudiantiles o familias anfitrionas.</li>
                                <li>Talleres y visitas corporativas exclusivas.</li>
                                <li>Certificación oficial con valor curricular.</li>
                                <li>Acompañamiento 24/7 por parte del equipo de Learn & Travel.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Reserva tu Lugar</h3>
                            <p className="text-sm text-slate-500 mb-6">Cupo limitado. Asegura tu participación hoy mismo.</p>

                            <ReserveButton
                                title={program.title}
                                image={program.image}
                                description={program.description}
                                plans={program.plans}
                            />

                            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400">
                                    ¿Tienes dudas? <a href="#" className="underline hover:text-primary">Contacta a un asesor</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
