import StudentOnboardingWizard from '@/components/onboarding/StudentOnboardingWizard';

interface PageProps {
    params: Promise<{
        token: string;
        locale: string;
    }>;
}

export default async function StudentOnboardingPage({ params }: PageProps) {
    const { token } = await params;

    return <StudentOnboardingWizard token={token} />;
}
