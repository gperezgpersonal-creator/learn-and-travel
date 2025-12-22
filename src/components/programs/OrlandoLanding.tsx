'use client';

import { useState } from 'react';
import { Program } from '@/data/programs';
import Image from 'next/image';
import { Star, Users, Lightbulb, Check, Calendar, Shield, GraduationCap, Plane, Wallet, FileCheck, Trophy, ArrowRight, X, Hotel, Bus } from 'lucide-react';
import LivePricing from '@/components/programs/LivePricing';

export default function OrlandoLanding({ program }: { program: Program }) {
    const [isMaxwellModalOpen, setIsMaxwellModalOpen] = useState(false);
    const [isDisneyModalOpen, setIsDisneyModalOpen] = useState(false);

    return (
        <main className="font-sans text-slate-800 bg-white selection:bg-yellow-200">
            {/* HERO SECTION - BLUEPRINT DESIGN */}
            <section className="relative min-h-screen w-full overflow-hidden flex flex-col bg-[#0e1b3d] font-mono selection:bg-blue-500">

                {/* FULL SCREEN BACKGROUND */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/orlando-blueprint.png"
                        alt="Orlando Blueprint"
                        fill
                        className="object-cover opacity-100 mix-blend-luminosity"
                        priority
                    />
                    {/* Lighter Overlay */}
                    <div className="absolute inset-0 bg-[#0e1b3d]/50 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b3d]/90 via-transparent to-[#0e1b3d]/40" />
                </div>

                {/* HERO CONTENT */}
                <div className="relative z-10 w-full flex-grow flex flex-col justify-center px-4 md:px-12 lg:px-20 pt-10 pb-0">

                    <div className="w-full max-w-[90vw] mx-auto space-y-4 md:space-y-6">

                        {/* Status Line */}
                        <div className="inline-flex items-center gap-2 animate-in fade-in slide-in-from-left duration-700 delay-100">
                            <span className="w-12 h-[2px] bg-blue-400"></span>
                            <span className="text-blue-200 text-sm md:text-xl font-bold tracking-[0.2em] uppercase font-mono">Leadership Program</span>
                        </div>

                        {/* HEADLINE + PREPATEC LOGO CONTAINER (50/50 Split) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">

                            {/* Column 1: Text */}
                            <h1 className="text-6xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-bold tracking-tighter text-white leading-[0.85] font-sans">
                                THE WAY <br />
                                TO DO <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
                                    BUSINESS
                                </span>
                            </h1>

                            {/* Column 2: PrepaTEC Logo (Large) */}
                            <div className="relative w-full h-40 md:h-56 lg:h-72 flex justify-center lg:justify-end lg:pr-12 opacity-90">
                                <Image
                                    src="/images/prepatec-logo-white.png"
                                    alt="PrepaTEC"
                                    fill
                                    className="object-contain object-left lg:object-right"
                                />
                            </div>
                        </div>

                        {/* Sub-details */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 pt-4">
                            <span className="px-3 py-1 border border-white/30 text-white/80 text-xs font-bold uppercase tracking-widest">
                                Edición Exclusiva
                            </span>
                            <div className="text-white text-3xl md:text-4xl font-light tracking-wide font-sans">
                                ORLANDO 2026
                            </div>
                        </div>

                        <div className="inline-block px-6 py-3 bg-[#0e1b3d]/90 backdrop-blur-md border border-yellow-500/30 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.15)] mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                            <span className="text-yellow-400 text-xl md:text-2xl font-bold tracking-wide font-sans flex items-center gap-3">
                                <Calendar className="w-6 h-6" />
                                Del 14 al 19 de abril 2026
                            </span>
                        </div>

                        {/* CTA Area */}
                        <div className="flex flex-wrap items-center gap-8 pt-4 pb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                            <button
                                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-8 py-4 bg-yellow-400 text-[#0e1b3d] text-lg font-bold uppercase tracking-wider overflow-hidden hover:bg-yellow-300 transition-colors border-2 border-yellow-400"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    ¡Aparta tu lugar hoy!
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            {/* Tech Specs */}
                            <div className="flex items-center gap-8 text-xs text-blue-300/60 font-mono border-l border-white/20 pl-6">
                                <div className="flex flex-col">
                                    <span className="uppercase opacity-50 text-[10px]">Duration</span>
                                    <span className="font-bold text-white text-sm">6 Days</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="uppercase opacity-50 text-[10px]">Status</span>
                                    <span className="font-bold text-white text-sm">Accepting</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Ticker */}
                <div className="w-full h-8 border-t border-white/5 bg-[#0e1b3d]/40 backdrop-blur-sm flex items-center px-4 overflow-hidden z-10">
                    <div className="flex gap-8 text-[9px] font-mono text-blue-400/40 whitespace-nowrap animate-in fade-in duration-1000 delay-1000 w-full justify-center">
                        <span>SYSTEM: ONLINE</span>
                        <span>///</span>
                        <span>WAITLIST: ACTIVE</span>
                        <span>///</span>
                        <span>LOCATION: ORLANDO, FL</span>
                    </div>
                </div>

                {/* DISNEY LOGO BAR (White Pleca) */}
                <div className="relative z-20 w-full bg-white py-4 md:py-6 flex justify-center items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                    <div className="relative w-72 h-16 md:w-96 md:h-24">
                        <Image
                            src="/images/disney-imagination-logo.png"
                            alt="Disney Imagination Campus"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* INTRODUCCIÓN */}
            <section className="py-12 md:py-20 container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <div>
                            <span className="text-blue-900 font-bold tracking-wider text-sm uppercase mb-2 block">Introducción</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0e1b3d] leading-tight">
                                Más que un viaje, una <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">transformación profesional</span>
                            </h2>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Bienvenido a <strong className="text-blue-900">The Way to Do Business</strong>, una experiencia inmersiva diseñada para la próxima generación de líderes. Este programa no es un simple viaje escolar; es una exploración académica y vivencial en el corazón de la industria del entretenimiento y el servicio más exitosa del mundo: <strong className="text-blue-900">Orlando, Florida</strong>.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-yellow-400 pl-6">
                            Durante 6 días, combinaremos la magia de <strong className="text-blue-900">Disney Imagination Campus</strong> con la metodología de alto nivel de <strong className="text-blue-900">Maxwell Leadership</strong>. Nuestro objetivo es transformar tu visión sobre los negocios, la excelencia operativa y el liderazgo personal, brindándote herramientas tangibles para tu futuro universitario y profesional.
                        </p>
                        <p className="text-xl font-medium text-blue-900 italic">
                            Prepárate para salir del aula y entrar al laboratorio de negocios más grande del mundo.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-20 blur-2xl -z-10" />
                        <div className="relative grid grid-cols-2 gap-4">
                            <Image
                                src="/images/intro-group.jpg"
                                alt="Epcot Group"
                                width={400}
                                height={600}
                                className="rounded-2xl shadow-xl w-full h-80 object-cover transform translate-y-8 hover:-translate-y-2 transition-transform duration-500"
                            />
                            <Image
                                src="/images/intro-workshop.jpg"
                                alt="Workshop"
                                width={400}
                                height={600}
                                className="rounded-2xl shadow-xl w-full h-80 object-cover transform -translate-y-8 hover:-translate-y-12 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* PILARES ACADÉMICOS */}
            <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">Contenido Académico</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#0e1b3d] mb-6">Pilares del Programa</h2>
                        <p className="text-lg text-slate-600">
                            El programa se sustenta en dos grandes módulos de certificación que ofrecen valor curricular internacional.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Module 1: Disney */}
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/50 hover:shadow-2xl transition-all duration-300 border border-slate-100 group flex flex-col">
                            {/* COVER IMAGE */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&q=80&w=800"
                                    alt="Disney Methodology"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-900/10 transition-colors" />
                                <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-2xl font-bold text-[#0e1b3d] mb-2">01. Liderazgo e Innovación: The Disney Way</h3>
                                <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-6">Impartido en Disney Imagination Campus (EPCOT)</p>

                                <p className="text-slate-600 mb-8 italic">
                                    ¿Cómo logra una empresa mantener la excelencia y la magia los 365 días del año? En este taller exclusivo, descubrirás los secretos detrás de la cultura corporativa de Disney.
                                </p>

                                <div className="space-y-4 mb-8">
                                    {/* List items ... */}
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-blue-700 font-bold text-sm">A</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0e1b3d]">La Cultura del &quot;Cast Member&quot;</h4>
                                            <p className="text-sm text-slate-600">Entenderás cómo Disney capacita a su personal para que cada interacción sea mágica.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-blue-700 font-bold text-sm">B</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0e1b3d]">Las 5 Claves de la Excelencia</h4>
                                            <p className="text-sm text-slate-600">Analizaremos los pilares de Seguridad, Cortesía, Show, Eficiencia e Inclusión.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-blue-700 font-bold text-sm">C</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0e1b3d]">Pensamiento Crítico y Resolución</h4>
                                            <p className="text-sm text-slate-600">Desafíos en tiempo real dentro del parque para aprender a tomar decisiones.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION BUTTON */}
                                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-center">
                                    <button
                                        onClick={() => setIsDisneyModalOpen(true)}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-blue-600 pb-1"
                                    >
                                        Leer programa detallado
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* MODAL DISNEY DETAILS */}
                        {isDisneyModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDisneyModalOpen(false)}>
                                <div
                                    className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header */}
                                    <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#0e1b3d]">Leadership Workshop: The Disney Way</h3>
                                            <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">Impartido en Disney Imagination Campus</p>
                                        </div>
                                        <button
                                            onClick={() => setIsDisneyModalOpen(false)}
                                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                        >
                                            <X className="w-6 h-6 text-slate-500" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 space-y-6 text-slate-600 leading-relaxed text-lg">
                                        <p className="font-medium text-xl text-[#0e1b3d] italic">
                                            &quot;¿Qué tienen en común los estudiantes universitarios, de preparatoria y de secundaria? El potencial de convertirse en líderes.&quot;
                                        </p>

                                        <p>
                                            En el programa de desarrollo de liderazgo juvenil de <strong className="text-blue-900">Disney Imagination Campus</strong>, los estudiantes tendrán una oportunidad única para descubrir su potencial interactuando con líderes de Disney, participando en actividades de liderazgo y experimentando un aprendizaje práctico y divertido.
                                        </p>

                                        <p>
                                            Los talleres de liderazgo que ofrecemos son una manera extraordinaria para que los estudiantes aprendan comunicación efectiva, pensamiento crítico y el arte de la innovación. En ellos, explorarán el <strong>The Disney Way</strong>, que incluye la creencia de que todos pueden ser líderes. Además, aprenderán sobre la importancia de las <strong className="text-blue-900">5 Claves de Excelencia de Disney</strong>, principios que guían a los Miembros del Elenco de Disney en todo lo que hacen.
                                        </p>

                                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start gap-4">
                                            <Star className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-[#0e1b3d] mb-1">Duración y Ubicación</h4>
                                                <p className="text-sm text-blue-800">
                                                    2.5 hrs de taller impartido en Imagination Campus (dentro de Epcot Center Park).
                                                </p>
                                            </div>
                                        </div>

                                        <p>
                                            Los estudiantes experimentarán la aplicación real de estos principios al enfrentar escenarios de resolución de problemas, y descubrirán su propio estilo de liderazgo personal.
                                        </p>

                                        <h4 className="text-xl font-bold text-[#0e1b3d] mt-8 mb-4 border-l-4 border-blue-500 pl-4">Objetivos de Aprendizaje Clave</h4>
                                        <p className="mb-4">Después de completar este taller, los estudiantes podrán:</p>

                                        <ul className="space-y-3">
                                            {[
                                                "Conocer su propio estilo de liderazgo y continuar desarrollando sus habilidades de liderazgo personal.",
                                                "Describir y analizar la relación entre la excelencia del empleado, la satisfacción del cliente y los resultados comerciales.",
                                                "Colaborar con diversos socios para resolver problemas.",
                                                "Discutir la importancia de la diversidad al formar un equipo.",
                                                "Comprender el valor de una actitud positiva frente a cualquier desafío.",
                                                "Describir las 5 Claves de Excelencia de Disney y cómo impactan la capacidad de una gran organización para resolver problemas rápidamente."
                                            ].map((obj, i) => (
                                                <li key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-blue-700 font-bold text-xs">{i + 1}</span>
                                                    </div>
                                                    <span className="text-slate-700">{obj}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Module 2: Maxwell */}
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/50 hover:shadow-2xl transition-all duration-300 border border-slate-100 group flex flex-col">
                            {/* COVER IMAGE */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                                    alt="Maxwell Leadership"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-yellow-900/20 group-hover:bg-yellow-900/10 transition-colors" />
                                <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-2xl font-bold text-[#0e1b3d] mb-2">02. Liderazgo Exponencial & Gestión Personal</h3>
                                <p className="text-sm font-bold text-yellow-600 uppercase tracking-wide mb-6">Impartido por el Coach Marco Mejía (Coach internacional)</p>

                                <p className="text-slate-600 mb-8 italic">
                                    Ser un líder comienza por liderarse a uno mismo. Este programa utiliza la metodología DISC para potenciar tus habilidades blandas.
                                </p>

                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-yellow-400">
                                        <h4 className="font-bold text-[#0e1b3d]">Inteligencia Emocional y Burnout</h4>
                                        <p className="text-sm text-slate-600">Aprenderás a gestionar el estrés y equilibrar el alto rendimiento con el bienestar.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-yellow-400">
                                        <h4 className="font-bold text-[#0e1b3d]">Liderazgo sin Jerarquías</h4>
                                        <p className="text-sm text-slate-600">Descubrirás cómo influir positivamente en tu entorno desde cualquier posición.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-yellow-400">
                                        <h4 className="font-bold text-[#0e1b3d]">Productividad y Enfoque</h4>
                                        <p className="text-sm text-slate-600">Herramientas esenciales de gestión para tu futura carrera universitaria.</p>
                                    </div>
                                </div>

                                {/* ACTION BUTTON */}
                                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-center">
                                    <button
                                        onClick={() => setIsMaxwellModalOpen(true)}
                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-indigo-600 pb-1"
                                    >
                                        Leer programa detallado
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL MAXWELL DETAILS */}
                {isMaxwellModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMaxwellModalOpen(false)}>
                        <div
                            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0e1b3d]">Liderazgo Exponencial</h3>
                                    <p className="text-sm text-yellow-600 font-bold uppercase tracking-wider">Un programa para nuevos líderes</p>
                                </div>
                                <button
                                    onClick={() => setIsMaxwellModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    Nuestro programa está enfocado en el desarrollo del <strong className="text-indigo-900">liderazgo exponencial</strong>, proporcionando a los alumnos las herramientas necesarias para descubrir y perfeccionar su propio estilo de liderazgo a través de nuestra metodología <strong className="text-indigo-900">DISC: Descubrimiento, Implementación, Seguimiento y Celebración</strong>.
                                </p>
                                <p>
                                    En este proceso, expondremos a los estudiantes a nuevos conceptos, los retaremos y apoyaremos en la generación de sus <strong>Planes de Acción Personales</strong>. Estos planes los ayudarán a implementar todo lo aprendido durante el curso, y les daremos seguimiento para, semanas después, reunirnos nuevamente de forma virtual y celebrar el progreso alcanzado.
                                </p>

                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-[#0e1b3d] mb-3">Salud Mental y Productividad</h4>
                                    <p className="mb-4">
                                        A lo largo del curso, los estudiantes aprenderán técnicas esenciales para <strong>evitar el burnout</strong>, una amenaza común en entornos de alta presión. Se les enseñará a identificar los signos tempranos del agotamiento y a implementar estrategias efectivas para mantener un equilibrio saludable entre la vida personal y profesional.
                                    </p>
                                    <p>
                                        Además, se trabajará en mejorar su <strong>productividad personal</strong>, dotándolos de habilidades organizativas y de gestión del tiempo que les permitirán maximizar su eficiencia sin sacrificar su bienestar.
                                    </p>
                                </div>

                                <h4 className="bg-yellow-400/20 inline-block px-3 py-1 rounded text-[#0e1b3d] font-bold text-sm uppercase tracking-wider mb-2">Liderazgo sin Jerarquías</h4>
                                <p>
                                    El programa también aborda un desafío particular que enfrentan los líderes emergentes: operar en contextos donde la jerarquía tradicional no siempre reconoce su potencial. Les enseñaremos a demostrar su capacidad de liderazgo desde cualquier posición dentro de una organización.
                                </p>
                                <p>
                                    A través de ejercicios prácticos y estudios de caso, aprenderán a influir positivamente en su entorno, inspirar a sus colegas y liderar proyectos con éxito, independientemente de su título o nivel jerárquico. Aprenderán a generar más confianza en las personas y a utilizar diversas estrategias de empatía.
                                </p>

                                <hr className="border-slate-200" />

                                <h4 className="font-bold text-[#0e1b3d] mb-2">Metas y Futuro</h4>
                                <p>
                                    Además, los participantes descubrirán las mejores prácticas para establecer y alcanzar metas y objetivos claros. Se les proporcionarán herramientas para el seguimiento y la evaluación de su progreso, así como técnicas de motivación para mantenerse enfocados.
                                </p>
                                <p>
                                    Finalmente, el programa tiene como objetivo motivar a los estudiantes a ser profesionales en cualquier área que elijan. Se les animará a explorar diferentes campos y a aplicar los principios de liderazgo aprendidos en diversas situaciones.
                                </p>

                                <div className="bg-indigo-900 text-white p-8 rounded-2xl text-center mt-8">
                                    <p className="font-medium italic text-lg">
                                        &quot;Los alumnos saldrán del programa no solo como líderes más fuertes y seguros, sino también como individuos capacitados para enfrentar los desafíos del futuro con liderazgo, resiliencia y determinación.&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* STAR WARS BANNER */}
            <div className="w-full relative">
                <Image
                    src="/images/orlando-starwars-banner.png"
                    alt="Star Wars Galaxy's Edge"
                    width={1920}
                    height={400}
                    className="w-full h-auto"
                />
                {/* Shadow Overlay for smooth transition */}
                <div className="absolute inset-0 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)] pointer-events-none" />
            </div>

            {/* ITINERARIO */}
            <section className="py-24 bg-[#0e1b3d] text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-yellow-400 font-bold tracking-wider text-sm uppercase mb-2 block">Agenda del Viaje</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Itinerario de la Experiencia</h2> {/* Explicitly White */}
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            Una agenda diseñada para equilibrar el aprendizaje intensivo con la integración y la diversión.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                day: "DÍA 1", date: "Martes 14 de abril", title: "Inicia la aventura",
                                desc: "¡La espera ha terminado! Nos despedimos de la Ciudad de México y despegamos hacia la mágica ciudad de Orlando. Al llegar, nos instalaremos en el hotel y cerraremos el día con una increíble Cena de Bienvenida Sorpresa para conocernos y comenzar la diversión.",
                                icon: Plane,
                                image: "/images/adventure-start-day.png"
                            },
                            {
                                day: "DÍA 2", date: "Miércoles 15 de abril", title: "Hollywood Studios: Día de parque",
                                desc: "Nuestro primer día completo en Orlando nos lleva a los fantásticos Hollywood Studios. Aquí, nos adentraremos en el universo de Star Wars. Imagina pilotar el Millennium Falcon en la atracción Smugglers Run o escapar del Imperio en Rise of the Resistance. Además, podremos disfrutar de emocionantes shows y conocer a algunos de nuestros personajes favoritos de Disney. ¡La aventura está garantizada!",
                                icon: Star,
                                image: "/images/hollywood-studios-day.png"
                            },
                            {
                                day: "DÍA 3", date: "Jueves 16 de abril", title: "Leadership program & shopping",
                                desc: "Es momento de desarrollar nuestras habilidades con un curso de liderazgo impartido por un coach internacional certificado por John Maxwell. Pasaremos la mañana aprendiendo de los mejores y adquiriendo herramientas que nos servirán toda la vida. Por la tarde, nos dirigimos a los Premium Outlets, un paraíso para los amantes del shopping. Aquí, podremos encontrar las mejores marcas a precios increíbles. ¡Es tu oportunidad de renovar tu guardarropa con estilo!",
                                icon: Trophy,
                                image: "/images/leadership-day.png"
                            },
                            {
                                day: "DÍA 4", date: "Viernes 17 de abril", title: "The Disney way workshp & Epcot",
                                desc: "Hoy es uno de los días más esperados. Participaremos en el taller \"The Disney Way\" en el Imagination Campus de Disney. Durante la mañana, nos sumergiremos en un taller diseñado al estilo Disney, aprendiendo y experimentando de la mano de los líderes del Cast de Disney. Esta experiencia única te permitirá ver cómo se crea la magia y cómo puedes aplicarlo en tu vida diaria. ¡Una verdadera inspiración!",
                                icon: Lightbulb,
                                image: "/images/disney-way-day.png"
                            },
                            {
                                day: "DÍA 5", date: "Sábado 18 de abril", title: "Magic Kingdom: Día de parque",
                                desc: "Llegamos al corazón de la magia: Magic Kingdom. Este parque icónico nos espera con sus atracciones legendarias, desfiles llenos de color y, por supuesto, el impresionante show de fuegos artificiales y luces en el castillo de Cenicienta. Cada rincón del parque está lleno de maravillas, desde montañas rusas emocionantes hasta encuentros mágicos con tus personajes favoritos. Este día será pura magia de principio a fin.",
                                icon: Star,
                                image: "/images/magic-kingdom-day.png"
                            },
                            {
                                day: "DÍA 6", date: "Domingo 19 de abril", title: "Cierre de actividades",
                                desc: "Con el corazón lleno de recuerdos y la maleta repleta de compras y souvenirs, es hora de empacar y regresar a la Ciudad de México. Nos llevamos con nosotros la experiencia de un viaje extraordinario, lleno de aventuras, aprendizajes y momentos que quedarán grabados para siempre.",
                                icon: GraduationCap,
                                image: "/images/closure-day.png"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all group hover:-translate-y-1">
                                {/* CARD BANNER IMAGE */}
                                <div className="relative h-56 w-full">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Homogenizing Overlay */}
                                    <div className="absolute inset-0 bg-[#0e1b3d]/40 mix-blend-multiply transition-opacity group-hover:opacity-30" />
                                    <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-[#0e1b3d] text-xs font-bold rounded-full shadow-lg">
                                        {item.day}
                                    </div>
                                </div>

                                <div className="p-6 pt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <item.icon className="w-4 h-4 text-yellow-400" />
                                        <span className="text-slate-400 text-sm font-medium">{item.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LOGISTICS SECTION */}
            <section className="py-24 bg-white container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Logística del Viaje</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0e1b3d] mb-6">Detalles del Servicio</h2>
                    <p className="text-lg text-slate-600">
                        Todo resuelto para que tú solo te preocupes por aprender y disfrutar.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* HOTEL */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                            <Hotel className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0e1b3d] mb-4">Alojamiento Premium</h3>
                        <div className="space-y-3 text-slate-600">
                            <p className="font-semibold text-blue-900">Hilton Garden Inn Lake Buena Vista</p>
                            <ul className="text-sm space-y-2">
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Ocupación Doble</span>
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Camas Separadas (Queen)</span>
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Hot Breakfast incluido</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* VUELOS */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                            <Plane className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0e1b3d] mb-4">Vuelo Redondo</h3>
                        <div className="space-y-3 text-slate-600">
                            <p className="font-semibold text-blue-900">CDMX - Orlando - CDMX</p>
                            <ul className="text-sm space-y-2">
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Vuelo Directo</span>
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Artículo Personal</span>
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Maleta Carry-On (10kg)</span>
                                </li>
                                <li className="flex gap-2 text-slate-400">
                                    <X className="w-4 h-4 mt-0.5" />
                                    <span>No incluye documentada</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* TRANSPORTE */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 text-yellow-600">
                            <Bus className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0e1b3d] mb-4">Transporte Privado</h3>
                        <div className="space-y-3 text-slate-600">
                            <p className="font-semibold text-blue-900">Movilidad Ejecutiva</p>
                            <ul className="text-sm space-y-2">
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Aeropuerto - Hotel - Aeropuerto</span>
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Traslados a Actividades</span>
                                </li>
                                <li className="flex gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Shuttle a Parques (Hotel)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* GALLERY BANNER */}
            <div className="w-full relative">
                <Image
                    src="/images/orlando-gallery-banner.png"
                    alt="Orlando Experience Gallery"
                    width={1920}
                    height={400}
                    className="w-full h-auto"
                />
                {/* Shadow Overlay for smooth transition */}
                <div className="absolute inset-0 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)] pointer-events-none" />
            </div>

            {/* INVESTMENT & REQUIREMENTS GRID */}
            <section id="pricing" className="py-24 bg-white container mx-auto px-4">
                <div className="grid xl:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: DETAILS & REQUIREMENTS */}
                    <div className="xl:col-span-7 space-y-12">

                        {/* INCLUSIONS */}
                        <div>
                            <h3 className="text-3xl font-bold text-[#0e1b3d] mb-8 flex items-center gap-3">
                                <FileCheck className="w-8 h-8 text-blue-600" />
                                Tu Inversión Incluye
                            </h3>
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
                                    {[
                                        "Vuelo Redondo: CDMX - Orlando - CDMX.",
                                        "Entradas a Parques: Hollywood Studios, Epcot y Magic Kingdom.",
                                        "Alojamiento: 5 Noches en hotel 3 estrellas (ocupación doble, 2 pax/hab).",
                                        "Alimentos: Hot Breakfast incluido diariamente en el hotel.",
                                        "Académico: Workshop Disney Way + Liderazgo Exponencial (Taller y Materiales).",
                                        "Certificación: Diploma de participación internacional (curricular).",
                                        "Seguimiento: Sesión online de refuerzo 4 semanas después del viaje.",
                                        "Transporte Privado: Aeropuerto - Hotel - Aeropuerto.",
                                        "Transporte Parques: Shuttle cortesía del hotel.",
                                        "Shopping: Visita a Premium Outlets (incluye transporte).",
                                        "Seguro Médico: Cobertura internacional para emergencias.",
                                        "Seguro Médico: Cobertura internacional para emergencias.",
                                        "Staff: Acompañamiento de 1 profesor por cada 15 alumnos.",
                                        "Cena de bienvenida sorpresa: Convivencia y mucha diversión (Día 1)."
                                    ].map((inc, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700 text-sm font-medium">{inc}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <p className="text-xs text-slate-500 text-center flex justify-center items-center gap-2">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                        Importante: No incluye comidas ni cenas (solo desayuno).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* REQUIREMENTS */}
                        <div>
                            <h3 className="text-3xl font-bold text-[#0e1b3d] mb-8 flex items-center gap-3">
                                <Shield className="w-8 h-8 text-blue-600" />
                                Requisitos y Registro
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-slate-200 rounded-2xl p-6">
                                    <h4 className="font-bold text-[#0e1b3d] mb-4">Perfil del Participante</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                            Estudiante activo de PrepaTEC.
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                            Cumplimiento lineamientos de conducta.
                                        </li>
                                    </ul>
                                </div>
                                <div className="border border-slate-200 rounded-2xl p-6">
                                    <h4 className="font-bold text-[#0e1b3d] mb-4">Documentación</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                            Pasaporte (vigencia mín. 6 meses).
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                            Visa Americana vigente.
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                                            <div>
                                                <span className="font-bold">¿Eres menor de edad?</span> ¡Claro que puedes ir!, solo necesitas tramitar tu formato SAM.
                                                <a href="https://www.inm.gob.mx/menores/publico/solicitud.html" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline mt-1">
                                                    Tramitar Formato SAM &rarr;
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT METHODS INFO */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <Wallet className="w-5 h-5" />
                                Facilidades de Pago
                            </h4>
                            <p className="text-sm text-blue-800 mb-2">
                                Para asegurar tu lugar, ofrecemos diversas modalidades:
                            </p>
                            <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                                <li><strong>Apartado Inicial:</strong> Reserva con solo $70 USD (Cupo limitado, ver en panel de pago).</li>
                                <li><strong>Financiamiento:</strong> Pagos diferidos hasta la fecha del viaje.</li>
                                <li><strong>Métodos:</strong> Tarjetas crédito/débito, Zelle y transferencias (MXN/USD).</li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PRICING WIDGET (Sticky) */}
                    <div className="xl:col-span-5">
                        <div className="sticky top-8">
                            <div className="bg-[#0e1b3d] rounded-[2rem] shadow-2xl shadow-blue-900/30 overflow-hidden relative">
                                {/* LIVE PRICING COMPONENT 
                                    - Wrapper is dark blue to support the white text of the Big Price Title.
                                    - Variant 'default' ensures the plans selector has its own white card.
                                */}
                                <div className="p-6 md:p-8">
                                    <LivePricing
                                        id="84-ORL2026"
                                        showTitle={true}
                                        variant="default"
                                    />
                                </div>

                                <div className="bg-[#0a142f] p-4 text-center border-t border-white/10">
                                    <p className="text-xs text-slate-400">
                                        ¿Estás listo para liderar el futuro? <br />
                                        <span className="font-bold text-yellow-400">Learn & Travel | PrepaTEC</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* TÉRMINOS Y CONDICIONES */}
            <section className="bg-slate-100 py-12 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">Términos y Condiciones para un Viaje Educativo</h3>
                    <div className="text-[10px] md:text-xs text-slate-500 space-y-4 max-w-5xl mx-auto text-justify leading-relaxed font-light">

                        <div>
                            <strong className="block text-slate-600 mb-1">1. Aceptación de los Términos</strong>
                            <p>Al reservar un viaje con Ariagui Services LLC y/o Learn and Travel, el participante, así como el contratante (la persona que realiza la contratación en nombre del participante), aceptan de manera inequívoca los siguientes términos y condiciones.</p>
                        </div>

                        <div>
                            <strong className="block text-slate-600 mb-1">2. Elegibilidad y Requisitos para los Participantes</strong>
                            <p>a) Los participantes pueden ser menores de 18 años y poseer un pasaporte y visa americana vigentes. El pasaporte debe tener una validez mínima de 6 meses antes de entrar a Estados Unidos y la visa americana debe estar vigente al menos hasta el día de regreso del viaje.</p>
                            <p className="mt-1">b) Los participantes deben ser miembros del Tecnológico de Monterrey. Participantes externos a la institución pueden unirse solo si están invitados por un estudiante participante del viaje y cuentan con la autorización del responsable de la institución.</p>
                        </div>

                        <div>
                            <strong className="block text-slate-600 mb-1">3. Pagos y Tarifas</strong>
                            <p>a) Los depósitos se realizan en línea con tarjeta de crédito o débito en las fechas de vencimiento indicadas en la página del viaje. La falta de cumplimiento con estas fechas implica penalizaciones también descritas en la página.</p>
                            <p className="mt-1">b) Para pagos por transferencia interbancaria, el participante debe realizar el pago en la cuenta de Ariagui Services LLC. Los detalles de la cuenta se proporcionarán a través de nuestro número de WhatsApp. En disputas sobre el tipo de cambio, se usará el precio de venta de Citi Banamex México. Transferencias nacionales debe añadirse 16% IVA al monto total publicado.</p>
                            <p className="mt-1">c) En viajes con vuelo incluido, no se realizarán devoluciones en inscripciones y/o anticipos. Los boletos de avión no son endosables ni sujetos a cambios de nombre o fecha. La no presentación en el vuelo de ida puede resultar en la pérdida del vuelo de regreso, según las políticas de NO SHOW de las aerolíneas.</p>
                            <p className="mt-1">d) Política de Cancelación y Reembolsos: Cancelación antes de 60 días de la salida: Devolución del 50% de los pagos realizados. Cancelación antes de 30 días de la salida: Devolución del 30% de los pagos realizados. Cancelación antes de 14 días de la salida: No hay devolución. El proceso de reembolso se realizará al tipo de cambio vigente o al que se efectuaron los depósitos. Si el tipo de cambio es mayor, se devolverá el monto al tipo de cambio del depósito. El proceso de devolución, en caso de aplicar, requiere llenar el formulario de devolución.</p>
                        </div>

                        <div>
                            <strong className="block text-slate-600 mb-1">4. Ocupaciones Triples o Cuádruples</strong>
                            <p>La ocupación predefinida es doble (comparten habitación), si el estudiante quiere ocupación triple o cuádruple (comparte cama con alumnos del mismo sexo) deberá consultarlo antes con sus compañeros interesados y comunicarlo vía whatsapp para checar disponibilidad. Solo se permiten cambios si se desea cambiar a ocupación doble con costo adicional.</p>
                        </div>

                        <div>
                            <strong className="block text-slate-600 mb-1">5. Seguros y Reglamentos</strong>
                            <p>Learn and Travel proporcionará un seguro de gastos médicos contratado con Assist Card. La póliza será enviada a los participantes al menos 5 días antes del viaje. Ariagui Services LLC y/o Learn and Travel no actuarán como intermediarios entre la aseguradora y el asegurado, excepto en la contratación del seguro. Se recomienda revisar las condiciones generales en la póliza. Todos los participantes deben firmar una carta responsiva por parte de la institución y aceptar el reglamento del programa para asistir al viaje.</p>
                        </div>

                        <div>
                            <strong className="block text-slate-600 mb-1">6. Itinerario y Cambios en el Programa</strong>
                            <p>a) Las visitas a partners, empresas, instituciones y cualquier otra actividad académica están sujetas a cambios por disponibilidad. Estos cambios pueden ocurrir incluso el mismo día de la actividad, sin responsabilidad para Learn and Travel. Se buscará alternativas similares para cumplir con el número de visitas programadas.</p>
                            <p className="mt-1">b) El número de visitas diarias puede ajustarse según la disponibilidad de nuestros partners, conforme al promedio indicado en la sección "¿Qué incluye?".</p>
                            <p className="mt-1">c) Si el programa se ve afectado por responsabilidades de la aerolínea, Learn and Travel intentará ajustar las actividades sin modificar la fecha de regreso.</p>
                        </div>

                        <div>
                            <strong className="block text-slate-600 mb-1">7. Limitación de Responsabilidad</strong>
                            <p>a) Ariagui Services LLC y/o Learn and Travel no se responsabilizan por servicios prestados por terceros, como hoteles, aviones, transportes, etc., ya que actúan únicamente como intermediarios en la coordinación de estos servicios para el grupo. Cualquier inconformidad con estos servicios debe ser dirigida y gestionada directamente con el proveedor del servicio.</p>
                            <p className="mt-1">b) Ariagui Services LLC y/o Learn and Travel no intervendrán en asuntos relacionados con seguros de viajero, gastos médicos, reclamaciones a terceros, ni en actividades penalizadas por las autoridades del país visitado. Cualquier necesidad de asistencia legal debe ser gestionada directamente por el participante.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
}
