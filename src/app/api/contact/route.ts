import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, interest, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        // Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Simplest for Gmail, can be configured for other SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
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
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Contact API Error:', error);

        // Debugging: Return specific error to client
        return NextResponse.json(
            { error: `Error técnico: ${error.message}` },
            { status: 500 }
        );
    }
}
