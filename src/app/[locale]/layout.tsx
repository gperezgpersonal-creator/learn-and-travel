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

export const metadata = {
    metadataBase: new URL('https://learn-and-travel.com'),
    title: "Learn and Travel | Experiencias Educativas Internacionales",
    description: "Experiencias académicas internacionales, conecta con profesionales, aprende nuevos idiomas, y más. Experiencias que transforman vidas.",
    openGraph: {
        title: "Learn and Travel | Experiencias Educativas Internacionales",
        description: "Experiencias académicas internacionales, conecta con profesionales, aprende nuevos idiomas, y más. Experiencias que transforman vidas.",
        url: 'https://learn-and-travel.com',
        siteName: 'Learn and Travel',
        images: [
            {
                url: '/images/social-share.png', // Main social image
                width: 1200,
                height: 630,
            },
        ],
        locale: 'es_MX',
        type: 'website',
    },
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
