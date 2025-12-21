
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
}

export async function sendEmail({ to, subject, html, text, replyTo }: EmailOptions) {
    try {
        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'admin@learn-and-travel.com'
            : 'onboarding@resend.dev'; // Sandbox Mode

        await resend.emails.send({
            from: fromEmail,
            to: to,
            subject: subject,
            html: html,
            text: text,
            replyTo: replyTo,
        });

        console.log(`Email sent via Resend to ${to}`);
        return { success: true };
    } catch (error) {
        console.error('Resend Error:', error);
        return { success: false, error };
    }
}

