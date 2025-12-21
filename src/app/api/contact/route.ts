import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, interest, message, website_url } = body;

        // Security: Honeypot Check
        // If the hidden field is filled, it's likely a bot.
        if (website_url) {
            console.log('Honeypot triggered. Silently rejecting bot.');
            return NextResponse.json({ success: true }); // Fake success to confuse bot
        }

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        // 1. Save to Supabase (Contact Messages)
        const { error: dbError } = await supabase
            .from('contact_messages')
            .insert({
                name,
                email,
                interest,
                message,
                // status defaults to 'new'
            });

        if (dbError) {
            console.error('Error saving prospect:', dbError);
            // We continue to send email even if DB fails, or we could return error.
            // For now, log and continue.
        }

        await sendEmail({
            to: process.env.EMAIL_USER!, // Send to self
            replyTo: email,
            subject: `Nuevo mensaje de Contacto: ${name} - ${interest}`,
            text: `
                Nombre: ${name}
                Email: ${email}
                Interés: ${interest}
                
                Mensaje:
                ${message}
            `,
            html: `
                <h3>Nuevo mensaje del formulario web</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Interés:</strong> ${interest}</p>
                <br/>
                <p><strong>Mensaje:</strong></p>
                <p>${message.replace(/\n/g, '<br/>')}</p>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Contact API Error:', error);

        // Debugging: Return specific error to client
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Error técnico: ${errorMessage}` },
            { status: 500 }
        );
    }
}
