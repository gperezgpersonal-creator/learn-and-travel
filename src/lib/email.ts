
import nodemailer from 'nodemailer';

interface SendEmailParams {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
}

export async function sendEmail({ to, subject, text, html, replyTo }: SendEmailParams) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured (EMAIL_USER/EMAIL_PASS)');
        // In production, you might want to throw an error, 
        // but for dev/demos without creds, we can just log it.
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            replyTo,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
