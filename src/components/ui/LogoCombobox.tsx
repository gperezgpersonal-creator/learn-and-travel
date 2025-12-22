'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Helper to efficiently search/filter locally after initial fetch
// or we could search via DB if the list is huge. For < 1000 items, local filter is better UX.

interface Logo {
    id: string;
    label: string;
    url: string;
}

interface LogoComboboxProps {
    value: string; // URL of the selected logo
    onChange: (url: string, label?: string) => void;
    placeholder?: string;
}

export function LogoCombobox({ value, onChange, placeholder = "Buscar logotipo..." }: LogoComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [logos, setLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch logos on mount
    useEffect(() => {
        const fetchLogos = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('logos').select('id, label, url').order('label');
            if (data) setLogos(data);
            setLoading(false);
        };
        fetchLogos();
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredLogos = query === ''
        ? logos
        : logos.filter((logo) =>
            logo.label.toLowerCase().includes(query.toLowerCase())
        );

    // Find label for current value to display if not open
    const selectedLogo = logos.find(l => l.url === value);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2 truncate">
                    {value && (
                        <div className="w-5 h-5 flex-shrink-0 border border-slate-100 rounded bg-slate-50 p-0.5">
                            <img src={value} alt="" className="w-full h-full object-contain" />
                        </div>
                    )}
                    <span className={value ? "text-slate-700 font-medium" : "text-slate-400"}>
                        {selectedLogo?.label || (value ? 'Logo Personalizado' : placeholder)}
                    </span>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-slate-400 opacity-50" />
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="flex-1 text-sm outline-none text-slate-700 placeholder:text-slate-400"
                            placeholder="Filtrar..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="overflow-y-auto p-1 flex-1">
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            </div>
                        ) : filteredLogos.length === 0 ? (
                            <div className="p-3 text-center text-xs text-slate-400">
                                No se encontraron resultados.
                            </div>
                        ) : (
                            filteredLogos.map((logo) => (
                                <div
                                    key={logo.id}
                                    className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors ${value === logo.url ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-700"
                                        }`}
                                    onClick={() => {
                                        onChange(logo.url, logo.label);
                                        setOpen(false);
                                        setQuery('');
                                    }}
                                >
                                    <div className="w-8 h-8 flex-shrink-0 bg-white border border-slate-100 rounded p-1 flex items-center justify-center">
                                        <img src={logo.url} alt={logo.label} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <span className="text-sm font-medium truncate flex-1">{logo.label}</span>
                                    {value === logo.url && <Check className="w-4 h-4 flex-shrink-0" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
