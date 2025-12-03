'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useState } from 'react';

export default function Header() {
    const t = useTranslations('Navigation');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { href: '/', label: 'home' },
        { href: '/about', label: 'about' },
        { href: '/programs', label: 'programs' },
        { href: '/blog', label: 'blog' },
        { href: '/contact', label: 'contact' },
    ];

    return (
        <header className="h-20 bg-white shadow-sm sticky top-0 z-50">
            <div className="container-custom h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-serif font-bold text-primary" onClick={closeMenu}>
                    Learn and Travel
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-slate-800 hover:text-accent font-medium transition-colors"
                        >
                            {t(link.label)}
                        </Link>
                    ))}
                </nav>

                {/* Auth Actions & Lang Switch (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link href="/login" className="btn btn-outline py-2 px-4 text-sm">
                        {t('login')}
                    </Link>
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center gap-4 md:hidden">
                    <LanguageSwitcher />
                    <button
                        onClick={toggleMenu}
                        className="text-slate-800 p-2 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-white shadow-lg border-t border-slate-100 md:hidden flex flex-col p-6 gap-6 animate-in slide-in-from-top-5 duration-200">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className="text-lg text-slate-800 hover:text-primary font-medium transition-colors border-b border-slate-50 pb-2"
                            >
                                {t(link.label)}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/login"
                            onClick={closeMenu}
                            className="btn btn-primary w-full text-center"
                        >
                            {t('login')}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
