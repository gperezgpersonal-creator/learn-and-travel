
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach((line) => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
                if (key && !process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
} catch (e) {
    console.error("Could not load .env.local", e);
}

const key = process.env.RESEND_API_KEY;
if (!key) {
    console.error("RESEND_API_KEY not found");
    process.exit(1);
}

const resend = new Resend(key);

const recipient = 'guillermo@ariagui.com';
console.log(`Sending email to ${recipient}...`);

resend.emails.send({
    from: 'onboarding@learn-and-travel.com',
    to: recipient,
    subject: 'Prueba Externa - Configuración Resend 🌎',
    html: `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h1 style="color: #3b82f6;">¡Prueba de Dominio Externo!</h1>
      <p>Estamos probando la entrega a dominios fuera de la organización.</p>
      <p>Si lees esto, tu reputación de envío hacia el exterior está funcionando bien.</p>
      <ul>
         <li><strong>De:</strong> onboarding@learn-and-travel.com</li>
         <li><strong>Para:</strong> ${recipient}</li>
      </ul>
      <hr />
      <p><small>Enviado a las: ${new Date().toLocaleString()}</small></p>
    </div>
  `
}).then((data) => {
    console.log('Success:', data);
}).catch((err) => {
    console.error('Error:', err);
});
