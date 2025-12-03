import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('Legal');

    return (
        <main className="bg-white min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="mb-8">{t('termsTitle')}</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Last updated: December 2025</p>
                    <p>Please read these Terms of Service carefully before using the Learn and Travel website and services.</p>
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
                    <h3>2. Booking and Payments</h3>
                    <p>All bookings are subject to availability and confirmation. Payments must be made in accordance with the payment schedule provided at the time of booking.</p>
                    {/* More placeholder content */}
                </div>
            </div>
        </main>
    );
}
