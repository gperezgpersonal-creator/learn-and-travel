import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/navigation';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import '@/app/globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as any)) notFound();

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-slate-800 bg-slate-50`} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <CartProvider>
                        {children}
                        <CartDrawer />
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
