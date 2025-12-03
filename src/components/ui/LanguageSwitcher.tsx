'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const localActive = useLocale();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            // Replace the locale in the pathname
            // e.g. /es/about -> /en/about
            const segments = pathname.split('/');
            segments[1] = nextLocale;
            router.replace(segments.join('/'));
        });
    };

    return (
        <label className="border rounded px-2 py-1 text-sm bg-white text-slate-600">
            <span className="sr-only">Select language</span>
            <select
                defaultValue={localActive}
                className="bg-transparent py-1"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="es">ES</option>
                <option value="en">EN</option>
            </select>
        </label>
    );
}
