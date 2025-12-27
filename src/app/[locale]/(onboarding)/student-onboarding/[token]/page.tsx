import StudentOnboardingWizard from '@/components/onboarding/StudentOnboardingWizard';

interface PageProps {
    params: Promise<{
        token: string;
        locale: string;
    }>;
}

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Completa tu perfil - Learn & Travel',
        description: 'Por favor completa tu documentación y perfil para tu programa.',
        openGraph: {
            title: 'Completa tu perfil - Learn & Travel',
            description: 'Accede a tu cuenta de estudiante para subir tus documentos.',
        }
    };
}

export default async function StudentOnboardingPage({ params }: PageProps) {
    const { token } = await params;

    return <StudentOnboardingWizard token={token} />;
}
