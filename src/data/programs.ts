export interface Plan {
    name: string;
    price: number;
}

export interface Program {
    slug: string;
    title: string;
    location: string;
    duration: string;
    date: string;
    image: string;
    description: string;
    fullDescription: string; // Extended description for detail page
    plans: Plan[];
}

export const tecPrograms: Program[] = [
    {
        slug: "orlando-business-2026",
        title: "The Way to Do Business - Orlando ABRIL 2026",
        location: "Orlando, Florida",
        duration: "6 Días / 5 Noches",
        date: "Abril 2026",
        image: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?q=80&w=2070&auto=format&fit=crop", // Spaceship Earth or similar
        description: "Descubre el liderazgo y la innovación en Disney Imagination Campus.",
        fullDescription: "¡Descubre el futuro de los negocios! Un programa académico de alto nivel en Disney Imagination Campus, donde participarás en talleres de liderazgo y creatividad, vivirás la magia de los parques y transformarás tu visión profesional.",
        plans: [
            { name: "Pago Total", price: 2950 },
            { name: "Apartado $50 USD", price: 50 },
            { name: "Plan Diferido (Total $3,100)", price: 3100 } // Example deferred price
        ]
    },
    {
        slug: "semana-i-innovacion-silicon-valley",
        title: "Semana i: Innovación en Silicon Valley",
        location: "San Francisco, USA",
        duration: "1 Semana",
        date: "Octubre 2025",
        image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2070&auto=format&fit=crop",
        description: "Inmersión total en el ecosistema de startups más importante del mundo.",
        fullDescription: "Vive una experiencia transformadora en el corazón de la innovación tecnológica. Durante esta semana intensiva, visitarás las sedes de gigantes tecnológicos como Google y Meta, participarás en talleres exclusivos con fundadores de startups y desarrollarás tu propia idea de negocio con mentoría de expertos de Silicon Valley. Este programa está diseñado para desafiar tu mentalidad y expandir tu red de contactos global.",
        plans: [
            { name: "Pago Total", price: 2500 },
            { name: "Anticipo", price: 500 },
            { name: "Plan Diferido (Total $2,800)", price: 2800 }
        ]
    },
    {
        slug: "verano-internacional-negocios-asia",
        title: "Verano Internacional: Negocios en Asia",
        location: "Shanghai & Tokyo",
        duration: "4 Semanas",
        date: "Junio 2025",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop",
        description: "Explora los mercados asiáticos y su impacto en la economía global.",
        fullDescription: "Sumérgete en la cultura y los negocios de las dos economías más dinámicas de Asia. Este programa combina clases académicas en universidades de prestigio con visitas corporativas a empresas líderes en manufactura, finanzas y tecnología. Entenderás de primera mano cómo funcionan los negocios en China y Japón, y cómo su cultura milenaria influye en sus prácticas empresariales modernas.",
        plans: [
            { name: "Pago Total", price: 4800 },
            { name: "Anticipo", price: 800 },
            { name: "Plan Diferido (Total $5,200)", price: 5200 }
        ]
    },
    {
        slug: "invierno-arquitectura-sostenible",
        title: "Invierno: Arquitectura Sostenible",
        location: "Copenhagen, Dinamarca",
        duration: "2 Semanas",
        date: "Enero 2026",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop",
        description: "Aprende de los líderes mundiales en diseño urbano y sostenibilidad.",
        fullDescription: "Copenhague es la capital mundial del diseño sostenible. En este curso intensivo, explorarás cómo la arquitectura puede mejorar la calidad de vida y reducir el impacto ambiental. Recorrerás proyectos icónicos, asistirás a conferencias con arquitectos renombrados y trabajarás en un proyecto práctico enfocado en soluciones urbanas para el futuro.",
        plans: [
            { name: "Pago Total", price: 3200 },
            { name: "Anticipo", price: 600 },
            { name: "Plan Diferido (Total $3,500)", price: 3500 }
        ]
    }
];
