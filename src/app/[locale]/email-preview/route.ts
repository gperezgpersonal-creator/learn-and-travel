import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import WelcomeOrlandoEmail from '@/components/emails/WelcomeOrlandoEmail';

export async function GET() {
    const emailHtml = await render(
        WelcomeOrlandoEmail({
            studentName: 'Estudiante de Prueba',
            dashboardUrl: 'https://learn-and-travel.com/dashboard/student',
        })
    );

    return new NextResponse(emailHtml, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
