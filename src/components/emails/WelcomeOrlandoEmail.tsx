import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Img,
    Heading,
    Text,
    Button,
    Hr,
    Link,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeOrlandoEmailProps {
    studentName: string;
    dashboardUrl?: string;
}

export default function WelcomeOrlandoEmail({
    studentName = 'Estudiante',
    dashboardUrl = 'https://learn-and-travel.com/dashboard/student',
}: WelcomeOrlandoEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>¡Bienvenido a Orlando 2026!</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* HEADER */}
                    <Section style={{ backgroundColor: '#0e1b3d', padding: '20px', textAlign: 'center' as const }}>
                        <Heading style={{ color: '#ffffff', fontFamily: 'serif', margin: 0, fontSize: '24px' }}>
                            THE WAY TO DO BUSINESS
                        </Heading>
                        <Text style={{ color: '#FFD700', fontSize: '12px', letterSpacing: '2px', margin: '5px 0 0', textTransform: 'uppercase' as const }}>
                            Learn & Travel
                        </Text>
                    </Section>

                    {/* HERO IMAGE */}
                    <Section>
                        <Img
                            src="https://images.unsplash.com/photo-1597466599360-3b9775841aec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            width="100%"
                            height="200"
                            alt="Orlando 2026"
                            style={{ objectFit: 'cover' as const }}
                        />
                    </Section>

                    {/* CONTENT */}
                    <Section style={content}>
                        <Heading style={h1}>¡Bienvenido a bordo, {studentName}!</Heading>
                        <Text style={text}>
                            Estamos muy emocionados de que hayas decidido iniciar este viaje con nosotros.
                            El programa <strong>Orlando Business & Entrepreneurship 2026</strong> será una experiencia inolvidable.
                        </Text>
                        <Text style={text}>
                            Hemos recibido tu registro correctamente. A partir de ahora, tendrás acceso a tu
                            panel exclusivo donde podrás ver:
                        </Text>
                        <ul style={{ ...text, paddingLeft: '20px' }}>
                            <li>📅 El itinerario actualizado</li>
                            <li>💳 Tu estado de cuenta y pagos</li>
                            <li>📄 Carga de documentos importantes</li>
                        </ul>

                        <Section style={btnContainer}>
                            <Button style={button} href={dashboardUrl}>
                                IR A MI PANEL DE ESTUDIANTE
                            </Button>
                        </Section>

                        <Hr style={hr} />

                        <Heading style={h2}>¿Qué sigue?</Heading>
                        <Text style={text}>
                            Nuestro equipo validará tus datos en las próximas 24 horas. Recibirás otra notificación
                            cuando tu perfil esté completamente activo.
                        </Text>
                    </Section>

                    {/* FOOTER */}
                    <Section style={footer}>
                        <Text style={{ ...footerText, marginBottom: '10px' }}>
                            <strong>The Way to Do Business</strong><br />
                            Una experiencia educativa de Learn & Travel
                        </Text>
                        <Link href="https://learn-and-travel.com" style={link}>Visitar Sitio Web</Link>
                        <Text style={footerText}>
                            © 2026 Learn & Travel. Todos los derechos reservados.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// STYLES
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '0',
    marginBottom: '64px',
    maxWidth: '600px',
    borderRadius: '8px',
    overflow: 'hidden' as const,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

const content = {
    padding: '40px',
};

const h1 = {
    color: '#0e1b3d',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px',
    fontFamily: 'serif',
};

const h2 = {
    color: '#0e1b3d',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '30px 0 10px',
};

const text = {
    color: '#525f7f',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const,
    margin: '0 0 16px',
};

const btnContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#FFD700',
    borderRadius: '4px',
    color: '#0e1b3d',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 32px',
    border: '1px solid #e5c100',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    backgroundColor: '#f6f9fc',
    padding: '32px',
    textAlign: 'center' as const,
};

const footerText = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
};

const link = {
    color: '#0e1b3d',
    fontSize: '12px',
    textDecoration: 'underline',
};
