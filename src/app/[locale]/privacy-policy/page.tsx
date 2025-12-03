import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
    const t = useTranslations('Legal');

    return (
        <main className="bg-white min-h-screen py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="mb-8">{t('privacyTitle')}</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Last updated: December 2025</p>
                    <p>At Learn and Travel, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
                    <h3>1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, book a trip, or contact us for support.</p>
                    <h3>2. How We Use Your Information</h3>
                    <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                    {/* More placeholder content */}
                </div>
            </div>
        </main>
    );
}
