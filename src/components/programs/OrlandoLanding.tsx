'use client';

import { Program } from '@/data/programs';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';
import { Check, Calendar, Star, MapPin, Users, Lightbulb, ExternalLink } from 'lucide-react';
import { Link } from '@/navigation';

export default function OrlandoLanding({ program }: { program: Program }) {
    const { addToCart } = useCart();
    const [activeTab, setActiveTab] = useState<'disney' | 'leadership'>('disney');

    const handleAddToCart = (planName: string, price: number) => {
        addToCart({
            id: program.slug, // Base ID, uniqueness handled in context by variant
            title: program.title,
            price: price,
            image: program.image,
            description: program.duration,
            plan: planName,
            variantId: planName.replace(/\s+/g, '-').toLowerCase()
        });
    };

    return (
        <main className="font-sans text-slate-800 bg-[#F5F7FA]">
            {/* Section 1: Header (Simulated sticky for this page context or relying on global header) */}
            {/* Note: Global header is already sticky. We'll focus on the page content. */}

            {/* Section 2: Hero */}
            <section className="relative w-full bg-[#00929F]"> {/* Fallback color from image */}
                <div className="relative w-full aspect-[21/9] md:aspect-[3/1] min-h-[300px]">
                    <Image
                        src="/images/orlando-hero.png"
                        alt="Disney Imagination Campus - What if? you imagine"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                </div>
                {/* Optional Overlays or text if needed, but the image has text baked in */}
            </section>

            {/* Section 2.5: CTA Strip (New) */}
            <div className="bg-[#122045] py-6 text-center border-b-4 border-[#FFD700]">
                <div className="container mx-auto px-4">
                    <p className="text-white text-lg mb-4 font-light">¿Listo para vivir la magia del liderazgo?</p>
                    <button
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-[#FFD700] hover:bg-yellow-400 text-[#122045] px-10 py-3 rounded-full text-lg font-bold tracking-wide transition-all transform hover:scale-105 shadow-lg"
                    >
                        ¡Inscríbete ahora!
                    </button>
                </div>
            </div>

            {/* Section 3: Intro & Impact */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                        <p>
                            Este programa te lleva a <span className="font-bold text-[#122045]">Disney Imagination Campus</span>, donde participarás en talleres prácticos que fomentan la creatividad y el pensamiento estratégico.
                        </p>
                        <p>
                            También formarás parte del <span className="font-bold text-[#122045]">International Lead Program Workshop</span>, impartido por un coach certificado por Maxwell Leadership, que te permitirá aplicar tu liderazgo de forma real y efectiva en tu entorno.
                        </p>
                        <p className="border-l-4 border-[#FFD700] pl-6 italic text-slate-600">
                            No te pierdas esta oportunidad exclusiva para ampliar tus horizontes, fortalecer tu desarrollo personal y dar un paso adelante hacia tu futuro profesional.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-8">
                            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg transform rotate-2">
                                <Image src="https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&q=80&w=800" alt="Workshop" fill className="object-cover" />
                            </div>
                            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg transform -rotate-1">
                                <Image src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" alt="Students" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg transform -rotate-2">
                                <Image src="https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=800" alt="Disney Park" fill className="object-cover" />
                            </div>
                            <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg transform rotate-1">
                                <Image src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800" alt="Leadership" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: What we will do? (Experience) */}
            <section className="py-24 bg-[#122045] text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#FFD700]">¿Qué vamos a hacer?</h2>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-200 leading-relaxed">
                            Un viaje de 6 días y 5 noches en Orlando, una ciudad que combina aprendizaje, liderazgo y diversión.
                            Conocerás de cerca la filosofía de empresas como Disney, participarás en talleres formativos y vivirás experiencias que impulsan tus habilidades sociales y tu crecimiento personal.
                        </p>
                        <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed mt-4">
                            Este es un programa especializado para futuros líderes, realizado dentro de EPCOT en Disney Imagination Campus, acompañado por un coach certificado que guiará a los estudiantes a descubrir y fortalecer su propio liderazgo.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Filosofía Disney", icon: Star, desc: "Aprende los secretos detrás de la magia empresarial de Disney. Descubre cómo la atención al detalle y la cultura de servicio crean experiencias inolvidables." },
                            { title: "Liderazgo Real", icon: MapPin, desc: "Talleres prácticos con coaches certificados por Maxwell Leadership. Desarrolla habilidades de comunicación, toma de decisiones y trabajo en equipo." },
                            { title: "Diversión Épica", icon: ExternalLink, desc: "Acceso ilimitado a los mejores parques temáticos del mundo: Epcot, Magic Kingdom y Hollywood Studios para celebrar tus logros." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-[#FFD700]/50 transition-all hover:-translate-y-2 group">
                                <item.icon className="w-12 h-12 text-[#FFD700] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                <p className="text-slate-300 group-hover:text-white transition-colors">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-gradient-to-r from-[#1a2d5c] to-[#122045] rounded-3xl p-8 md:p-12 border border-[#FFD700]/30 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                        <div className="flex-shrink-0 bg-[#FFD700]/20 p-4 rounded-full">
                            <Users className="w-12 h-12 text-[#FFD700]" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-2 text-white">¡Futuros líderes!</h3>
                            <p className="text-lg text-slate-200">
                                Recibirán capacitación en un programa de liderazgo juvenil que ofrece los principios de liderazgo creados por The Walt Disney Company,
                                la oportunidad de implementar innovación e interactuar con líderes de Disney, junto con desafíos estimulantes que hacen que aprender sobre liderazgo sea mágico.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Academic Detail (Tabs) */}
            <section className="py-20 bg-[#F5F7FA]">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center mb-12">
                        <div className="bg-white p-2 rounded-full shadow-md inline-flex">
                            <button
                                onClick={() => setActiveTab('disney')}
                                className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'disney'
                                    ? 'bg-[#122045] text-white shadow-lg'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                The Disney Way
                            </button>
                            <button
                                onClick={() => setActiveTab('leadership')}
                                className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'leadership'
                                    ? 'bg-[#122045] text-white shadow-lg'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                Liderazgo Exponencial
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto min-h-[500px]">
                        {activeTab === 'disney' ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                <h3 className="text-3xl font-serif font-bold text-[#122045] mb-4">Leadership Workshop The Disney Way</h3>
                                <p className="text-lg text-slate-700">
                                    ¿Qué tienen en común los estudiantes universitarios, de preparatoria y de secundaria? <span className="text-[#122045] font-bold">El potencial de convertirse en líderes.</span>
                                </p>
                                <p className="text-slate-600">
                                    En el programa de desarrollo de liderazgo juvenil de Disney Imagination Campus, los estudiantes tendrán una oportunidad única para descubrir su potencial interactuando con líderes de Disney.
                                </p>

                                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                    <h4 className="font-bold text-[#122045] mb-2 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                                        Detalles del Taller
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        2.5 hrs de taller impartido en Imagination Campus (dentro de Epcot Center Park).
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-[#122045] mb-4 text-lg">Objetivos de Aprendizaje Clave:</h4>
                                    <ul className="grid md:grid-cols-2 gap-4">
                                        {[
                                            "Conocer su propio estilo de liderazgo",
                                            "Relación entre excelencia, satisfacción y resultados",
                                            "Colaborar para resolver problemas",
                                            "Importancia de la diversidad en equipos",
                                            "Valor de la actitud positiva",
                                            "Las 5 Claves de Excelencia de Disney"
                                        ].map((obj, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-600">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-[#122045] flex-shrink-0" />
                                                {obj}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                <h3 className="text-3xl font-serif font-bold text-[#122045] mb-4">Liderazgo Exponencial: Un programa para nuevos líderes</h3>
                                <p className="text-lg text-slate-700">
                                    Nuestro programa está enfocado en el desarrollo del liderazgo exponencial para un mundo en constante cambio.
                                </p>
                                <div className="grid md:grid-cols-2 gap-8 mt-8">
                                    <div className="bg-slate-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-[#122045] mb-2">Metodología DISC</h4>
                                        <p className="text-sm text-slate-600">
                                            Herramientas para entender comportamientos y mejorar la comunicación efectiva dentro de los equipos.
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-[#122045] mb-2">Gestión del Burnout</h4>
                                        <p className="text-sm text-slate-600">
                                            Estrategias para mantener el alto rendimiento sin sacrificar el bienestar personal.
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-[#122045] mb-2">Liderazgo Moderno</h4>
                                        <p className="text-sm text-slate-600">
                                            Más allá de la jerarquía tradicional. Liderazgo basado en influencia, propósito y resultados.
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-[#122045] mb-2">Enfoque Integral</h4>
                                        <p className="text-sm text-slate-600">
                                            Desarrollo de habilidades blandas (Soft Skills) esenciales para el siglo XXI.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 6: Itinerary */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-serif font-bold text-center text-[#122045] mb-12">¡Prepárate para una aventura inolvidable!</h2>

                    <div className="relative border-l-4 border-slate-100 ml-4 md:ml-auto md:w-3/4 space-y-12">
                        {[
                            { date: "14 de abril", title: "¡La espera ha terminado!", desc: "Vuelo CDMX -> Orlando. Check-in y noche de celebración.", icon: "✈️" },
                            { date: "1 de noviembre", title: "Hollywood Studios", desc: "Star Wars, Galaxy's Edge & Toy Story Land.", icon: "🎬" },
                            { date: "2 de noviembre", title: "Curso de Liderazgo & Shopping", desc: "Coach John Maxwell & Premium Outlets.", icon: "🛍️" },
                            { date: "3 de noviembre", title: "Imagina y Crea", desc: "Taller 'The Disney Way' en Imagination Campus y Epcot.", icon: "🌐" },
                            { date: "4 de noviembre", title: "Magic Kingdom", desc: "Atracciones clásicas y Fuegos Artificiales.", icon: "🏰" },
                            { date: "5 de noviembre", title: "Regreso a Casa", desc: "Vuelo de regreso a CDMX con nuevas metas.", icon: "🏠" },
                        ].map((day, i) => (
                            <div key={i} className="relative pl-8">
                                <div className="absolute -left-[22px] top-0 w-10 h-10 bg-white border-4 border-[#FFD700] rounded-full flex items-center justify-center text-xl shadow-sm z-10">
                                    {day.icon}
                                </div>
                                <div className="bg-[#F5F7FA] p-6 rounded-xl hover:shadow-md transition-shadow">
                                    <span className="text-sm font-bold text-[#122045] bg-[#FFD700]/20 px-3 py-1 rounded-full mb-2 inline-block">
                                        {day.date}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-800 mt-2">{day.title}</h3>
                                    <p className="text-slate-600 mt-1">{day.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-8 italic">* Itinerario sujeto a cambios logísticos. Fechas ilustrativas según brief.</p>
                </div>
            </section>

            {/* Section 7: Pricing & Interactive CTA */}
            <section id="pricing" className="py-24 bg-[#122045] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        {/* Inclusion List */}
                        <div className="p-8 md:p-12 md:w-3/5 bg-slate-50">
                            <h2 className="text-2xl font-serif font-bold text-[#122045] mb-6">¿Qué incluye tu inversión?</h2>
                            <ul className="space-y-4">
                                {[
                                    "Experiencia académica: Workshop Leadership the Disney Way & Programa Liderazgo Exponencial.",
                                    "Entradas a los 3 parques principales.",
                                    "Vuelo internacional CDMX - Orlando - CDMX.",
                                    "Hospedaje 3 estrellas ocupación doble (con desayuno).",
                                    "Transporte privado aeropuerto-hotel-outlets.",
                                    "Seguro médico internacional.",
                                    "Certificado de participación."
                                ].map((inc, i) => (
                                    <li key={i} className="flex gap-3 text-slate-700">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                        <span>{inc}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-200">
                                * No incluye alimentos ni bebidas (salvo desayuno).
                            </p>
                        </div>

                        {/* Price & Actions */}
                        <div className="p-8 md:p-12 md:w-2/5 bg-[#122045] text-white flex flex-col justify-center text-center">
                            <p className="text-sm uppercase tracking-widest text-[#FFD700] font-bold mb-2">Inversión Total</p>
                            <div className="text-5xl font-bold mb-2 font-serif">
                                $2,950 <span className="text-lg font-sans font-normal text-slate-300">USD</span>
                            </div>
                            <p className="text-slate-300 text-sm mb-8">Pago de contado en ocupación doble.</p>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleAddToCart('Pago Total', 2950)}
                                    className="w-full bg-[#FFD700] text-[#122045] py-4 rounded-xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg"
                                >
                                    Pagar Totalidad
                                </button>
                                <button
                                    onClick={() => handleAddToCart('Apartado $50 USD', 50)}
                                    className="w-full bg-transparent border-2 border-white/30 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                                >
                                    Apartar con $50 USD
                                </button>
                                <p className="text-[10px] text-slate-400 mt-2">
                                    ¡CUPO LIMITADO! Aceptamos tarjetas y transferencias (MX/USA).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 9: Legal Footer (Mini) */}
            <div className="bg-slate-900 py-12 text-slate-400 text-sm">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-white font-bold mb-4">Requisitos y Cancelaciones</h4>
                        <p className="mb-2">Requisito indispensable: Pasaporte y visa americana vigente.</p>
                        <p>Cancelaciones: Reembolso completo hasta 60 días antes. 50% hasta 30 días antes. Sin reembolso a menos de 14 días.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Contacto</h4>
                        <p>Dudas: <a href="mailto:mmucino@tec.mx" className="text-[#FFD700] hover:underline">mmucino@tec.mx</a></p>
                        <p>Whatsapp: (+52) 55 2117 2433</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
