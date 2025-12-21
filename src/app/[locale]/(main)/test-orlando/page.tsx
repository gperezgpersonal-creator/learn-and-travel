'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function TestOrlandoPage() {
    return (
        <main className="min-h-screen bg-[#0e1b3d] font-mono selection:bg-blue-500 relative overflow-hidden flex flex-col">

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
            <section className="relative z-10 w-full flex-grow flex flex-col justify-center px-4 md:px-12 lg:px-20 pt-10 pb-0">

                <div className="w-full max-w-[90vw] mx-auto space-y-4 md:space-y-6">

                    {/* Status Line */}
                    <div className="inline-flex items-center gap-2 animate-in fade-in slide-in-from-left duration-700 delay-100">
                        <span className="w-8 h-[2px] bg-blue-400"></span>
                        <span className="text-blue-300 text-xs font-bold tracking-widest uppercase font-mono">Master Plan</span>
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

                    <div className="text-blue-200/80 text-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 font-sans">
                        Del 14 al 19 de abril 2026
                    </div>

                    {/* CTA Area */}
                    <div className="flex flex-wrap items-center gap-8 pt-4 pb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        <button className="group relative px-8 py-4 bg-white text-[#0e1b3d] text-lg font-bold uppercase tracking-wider overflow-hidden hover:bg-blue-50 transition-colors border-2 border-white">
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
            </section>

            {/* Footer Ticker - Positioned closer to bottom */}
            <div className="w-full h-8 border-t border-white/5 bg-[#0e1b3d]/40 backdrop-blur-sm flex items-center px-4 overflow-hidden z-10">
                <div className="flex gap-8 text-[9px] font-mono text-blue-400/40 whitespace-nowrap animate-in fade-in duration-1000 delay-1000 w-full justify-center">
                    <span>SYSTEM: ONLINE</span>
                    <span>///</span>
                    <span>WAITLIST: ACTIVE</span>
                    <span>///</span>
                    <span>LOCATION: ORLANDO, FL</span>
                </div>
            </div>

            {/* DISNEY LOGO BAR (White Pleca) - Original Color Logo */}
            <div className="relative z-20 w-full bg-white py-4 md:py-6 flex justify-center items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
                <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                <div className="relative w-72 h-16 md:w-96 md:h-24">
                    <Image
                        src="/images/disney-imagination-logo.png"
                        alt="Disney Imagination Campus"
                        fill
                        className="object-contain"
                    // Removed filter: invert(1) to keep original colors
                    />
                </div>
            </div>
        </main>
    );
}
