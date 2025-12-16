'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import FadeIn from '@/components/ui/FadeIn';
import ReserveButton from '@/components/cart/ReserveButton';
import { tecPrograms } from '@/data/programs';

export default function TecPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanPassword = password.trim().toLowerCase();
        // Simple client-side hardcoded password for V1 MVP
        if (cleanPassword === 'tec2025' || cleanPassword === 'tec 2025') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Contraseña incorrecta. Intenta "tec2025"');
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50 py-20 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                    <div className="text-center mb-8">
                        <img src="/logo.png" alt="Learn and Travel" className="h-12 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-slate-800">Acceso Exclusivo</h1>
                        <p className="text-slate-500 mt-2">Ingresa la contraseña para ver los programas del Tec de Monterrey.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Ingresa tu clave de acceso"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                        >
                            Ver Programas
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    // Authenticated Content
    return (
        <main>
            {/* Hero */}
            <section className="relative h-[50vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop)' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="container-custom relative z-10 text-center">
                    <FadeIn direction="up">
                        <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                            Portal Exclusivo
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">Programas Tec de Monterrey</h1>
                        <p className="text-xl font-light opacity-90 max-w-2xl mx-auto">
                            Experiencias educativas internacionales curadas especialmente para tu institución.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tecPrograms.map((program, i) => (
                            <FadeIn key={program.slug} delay={i * 0.1} direction="up">
                                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-slate-100 flex flex-col h-full">
                                    <Link href={`/tec-de-monterrey/${program.slug}`} className="block relative h-56 overflow-hidden flex-shrink-0">
                                        <div className="absolute top-4 right-4 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            Exclusivo TEC
                                        </div>
                                        <Image
                                            src={program.image}
                                            alt={program.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </Link>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">
                                            {program.location}
                                        </div>
                                        <Link href={`/tec-de-monterrey/${program.slug}`}>
                                            <h3 className="text-xl font-bold text-slate-800 mb-4 hover:text-primary transition-colors">{program.title}</h3>
                                        </Link>

                                        <div className="flex items-center gap-6 text-sm text-slate-500 mb-6 font-medium">
                                            <span className="flex items-center gap-2">
                                                🗓️ {program.duration}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                🚀 {program.date}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                                            {program.description}
                                        </p>

                                        <div className="mt-auto">
                                            <ReserveButton
                                                title={program.title}
                                                image={program.image}
                                                description={program.description}
                                                plans={program.plans}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
