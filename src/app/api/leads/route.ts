
import { NextResponse, after } from 'next/server';
import { sendEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';
import { tecPrograms } from '@/data/programs';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
    try {
        // 1. Security: Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        if (!rateLimit(ip, 5, 60000)) { // 5 reqs per minute per IP
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const body = await req.json();
        const { programId, name, email, phone, interest, matricula, email_institucional, email_personal, escuela, campus, aviso_privacidad, birthDate } = body;

        // Validation for Program 84 specific fields
        if (programId === '84-ORL2026') {
            if (!matricula || !email_institucional || !escuela || !campus || !aviso_privacidad || !birthDate) {
                return NextResponse.json({ error: 'Faltan datos obligatorios del estudiante' }, { status: 400 });
            }

            // Validation: Just check it's not empty after trim (length enforced by DB/Client mostly, but we can check max)
            const cleanedMatricula = matricula.replace(/\s+/g, '').toUpperCase();
            if (cleanedMatricula.length > 9) {
                return NextResponse.json({ error: 'La matrícula no puede tener más de 9 caracteres' }, { status: 400 });
            }

            // Institutional Email Validation (must end with @tec.mx)
            if (!email_institucional.endsWith('@tec.mx')) {
                return NextResponse.json({ error: 'El correo institucional debe ser @tec.mx' }, { status: 400 });
            }
        } else if (!programId || !email) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        const program = tecPrograms.find(p => p.id === programId);
        const programTitle = program ? program.title : programId;

        // Background Processing
        after(async () => {


            // 1. Save to Supabase (Prospects)
            const dbTask = (async () => {
                const notes = JSON.stringify({
                    programId,
                    matricula,
                    email_institucional,
                    email_personal,
                    escuela,
                    campus,
                    aviso_privacidad
                }, null, 2);

                const { error } = await supabase.from('prospects').insert({
                    name,
                    email: email_institucional || email,
                    phone,
                    interest: `Program: ${programTitle}`,
                    message: `Lead form submission for ${programTitle}`,
                    source: 'lead_form',
                    form_id: programId, // Store source form ID
                    birth_date: birthDate, // Added birth_date
                    notes: notes
                });
                if (error) console.error('Supabase Error:', error);
                else console.log('Lead saved to Supabase prospects');
            })();

            // 2. Send Emails via Resend
            // Note: In Sandbox, we can ONLY email the verified account owner.
            const emailTask = (async () => {
                const adminHtml = `
                    <h2>Nuevo Lead (Supabase) 🚀</h2>
                    <ul>
                        <li><strong>Programa:</strong> ${programTitle}</li>
                        <li><strong>Nombre:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                    </ul>
                `;

                // For Prod: Send to Admin AND User. 
                // For Dev/Sandbox: Send ONLY to Admin (which is the verified email)
                // We simulate the flow.

                await sendEmail({
                    to: 'gperezg.personal@gmail.com', // HARDCODED for Sandbox testing
                    subject: `Nuevo Lead: ${name}`,
                    html: adminHtml
                });
                console.log('Admin email sent (Resend)');
            })();

            await Promise.all([dbTask, emailTask]);
        });

        return NextResponse.json({ success: true, redirectUrl: `/programs/tec-de-monterrey/${program?.slug}` });

    } catch (error: unknown) {
        console.error('API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
