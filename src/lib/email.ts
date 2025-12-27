import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
    react?: ReactElement;
}

export async function sendEmail({ to, subject, html, text, replyTo, react }: EmailOptions) {
    try {
        let emailHtml = html;

        // Render React component if provided
        if (react) {
            emailHtml = await render(react);
        }

        if (!emailHtml) {
            throw new Error('Email must have either HTML content or a React component');
        }

        // --- SAFETY INTERCEPTOR ---
        // Defines where to send emails during testing/development
        const SAFE_EMAIL = 'guillermo@ariagui.com';

        // Check if we should intercept (Defaults to checking if we are NOT in production, or if explicitly set)
        // You can change this logic to use an environment variable like process.env.EMAIL_SAFETY_MODE === 'true'
        const isSafetyMode = process.env.NODE_ENV !== 'production' || process.env.EMAIL_SAFETY_MODE === 'true';

        let finalTo = to;
        let finalSubject = subject;
        let finalHtml = emailHtml;

        if (isSafetyMode) {
            console.log(`[EMAIL SAFETY] Intercepting email to: ${to}`);
            finalTo = SAFE_EMAIL;
            finalSubject = `[TEST MODE] ${subject}`;
            finalHtml = `
                <div style="background: #fff0f0; border: 1px solid #ff0000; color: #cc0000; padding: 10px; margin-bottom: 20px; font-family: monospace; font-size: 12px;">
                    <strong>⚠️ MODO PRUEBA ACTIVADO</strong><br/>
                    Este correo fue interceptado.<br/>
                    <strong>Destinatario Original:</strong> ${to}
                </div>
                ${finalHtml}
            `;
        }

        const fromEmail = process.env.NODE_ENV === 'production'
            ? 'Learn and Travel <admin@learn-and-travel.com>'
            : 'Learn and Travel <onboarding@resend.dev>'; // Sandbox Mode

        await resend.emails.send({
            from: fromEmail,
            to: finalTo,
            subject: finalSubject,
            html: finalHtml,
            text: text, // We could also append safety info to text, but HTML is primary
            replyTo: replyTo,
        });

        console.log(`Email sent via Resend to ${finalTo} (Original: ${to})`);
        return { success: true };
    } catch (error) {
        console.error('Resend Error:', error);
        return { success: false, error };
    }
}

