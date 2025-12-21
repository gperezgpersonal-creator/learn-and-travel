export interface Plan {
    name: string;
    price: number;
    deadline?: string; // ISO Date "YYYY-MM-DD"
    status?: 'active' | 'hidden' | 'sold_out'; // Control visibility
}

export interface Program {
    id: string; // Internal ID (e.g., ORL2026)
    slug: string;
    title: string;
    location: string;
    duration: string;
    date: string;
    image: string;
    description: string;
    fullDescription: string; // Extended description for detail page
    plans: Plan[];
    price: number;
    currency?: string;
}

export const tecPrograms: Program[] = [
    {
        id: "84-ORL2026",
        slug: "orlando-business-2026",
        title: "The Way to Do Business - Orlando ABRIL 2026",
        location: "Orlando, Florida",
        duration: "6 Días / 5 Noches",
        date: "Abril 2026",
        image: "/images/orlando-logo-text.jpg", // Spaceship Earth or similar
        description: "Descubre el liderazgo y la innovación en Disney Imagination Campus.",
        fullDescription: "¡Descubre el futuro de los negocios! Un programa académico de alto nivel en Disney Imagination Campus, donde participarás en talleres de liderazgo y creatividad, vivirás la magia de los parques y transformarás tu visión profesional.",
        price: 2950,
        currency: 'USD',
        plans: [
            { name: "Apartado (Reserva tu lugar)", price: 50, status: 'active' },
            { name: "Pago de Contado (Total $2,850)", price: 2850, deadline: "2026-01-20", status: 'active' },
            { name: "1er Pago (Plan Diferido)", price: 1000, deadline: "2026-01-20" },
            { name: "2do Pago (Plan Diferido)", price: 1000, deadline: "2026-02-20" },
            { name: "3er Pago (Plan Diferido)", price: 1000, deadline: "2026-03-20" }
        ]
    }
];
