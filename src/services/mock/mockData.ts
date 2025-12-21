export type UserRole = 'student' | 'parent' | 'staff' | 'partner';

export interface User {
    id: string;
    internalId?: string; // Added for consistency
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    linked_account_id?: string; // For parent/child relationship
    medicalInfo?: {
        allergies: string[];
        bloodType: string;
        medications: string;
        emergencyContact: {
            name: string;
            phone: string;
            relation: string;
        };
    };
}

export interface School {
    id: string;
    name: string;
    logo: string;
    contactName: string;
    contactEmail: string;
    address: string;
}

export interface Trip {
    id: string;
    internalId?: string; // New field
    programId?: string; // Link to CMS Program
    schoolId?: string; // Link to School (B2B)
    destination: string;
    title: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'past';
    price: number;
    image: string;
    programDetails: string; // HTML content
}

export interface Document {
    id: string;
    userId: string;
    type: 'passport' | 'visa' | 'form' | 'insurance' | 'rules';
    name: string;
    status: 'pending' | 'review' | 'approved' | 'rejected';
    url: string;
    uploadedAt?: string;
    feedback?: string;
    requiresSignature?: boolean;
    isSigned?: boolean;
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    date: string;
    concept: string;
    status: 'paid' | 'pending' | 'overdue';
    type: 'charge' | 'payment';
}

export interface Flight {
    id: string;
    tripId?: string; // Optional if linked to Program template
    programId?: string; // Linked to Program template
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureAirport: string;
    arrivalAirport: string;
    terminal: string;
    type: 'outbound' | 'return';
    // New fields
    category?: string; // e.g. Economy, Business
    seats?: string; // e.g. "12A, 12B" or "Assigned at check-in"
    cancellationPolicy?: string;
    notes?: string;
}

export interface Accommodation {
    id: string;
    tripId: string;
    type: 'host_family' | 'residence';
    name: string;
    address: string;
    contactPhone: string;
    roommate?: string;
    details: string;
}

export interface Activity {
    id: string;
    tripId: string;
    title: string;
    date: string;
    time: string;
    description: string;
    type: 'class' | 'excursion' | 'leisure';
}

export interface Resource {
    id: string;
    title: string;
    type: 'video' | 'pdf';
    url: string;
    thumbnail?: string;
}

export interface Message {
    id: string;
    userId: string; // The user involved in the chat
    sender: 'user' | 'staff';
    text: string;
    timestamp: string;
    read: boolean;
}

// STAFF PORTAL ENTITIES

export interface Lead {
    id: string;
    internalId?: string; // New field
    name: string;
    email: string; // Primary contact email (can be personal or educational)
    phone: string;
    programId: string; // Interest
    status: 'new' | 'contacted' | 'interested' | 'converted' | 'lost';
    createdAt: string;
    source: string;
    // New fields for Inquiry Form
    school?: string;
    studentId?: string;
    educationalEmail?: string;
    personalEmail?: string;
    privacyAccepted?: boolean;
}

export interface Provider {
    id: string;
    name: string;
    type: 'transport' | 'accommodation' | 'activity' | 'insurance';
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
}

export interface Agreement {
    id: string;
    providerId: string;
    title: string;
    validFrom: string;
    validTo: string;
    status: 'active' | 'expired' | 'pending';
    url: string; // Link to PDF
}

export interface ActivityLog {
    id: string;
    userId: string; // Staff who did it
    action: string;
    targetId: string; // ID of what was changed
    targetType: 'student' | 'trip' | 'document' | 'payment';
    timestamp: string;
    details: string;
}

// MOCK DATA

export const MOCK_USERS: User[] = [
    {
        id: 'contact-exemplary',
        internalId: 'S-2025-005',
        name: 'Valentina Perfecta',
        email: 'vale@good.com',
        role: 'student',
        avatar: 'https://i.pravatar.cc/150?u=valentina',
        linked_account_id: 'parent-exemplary',
        medicalInfo: {
            allergies: ['Peanuts'],
            bloodType: 'O+',
            medications: 'None',
            emergencyContact: {
                name: 'Maria Perfecta',
                phone: '+52 55 9999 8888',
                relation: 'Mother'
            }
        }
    },
    {
        id: 'student-problematic',
        internalId: 'S-2025-004',
        name: 'Kevin Desastre',
        email: 'kevin@student.com',
        role: 'student',
        avatar: 'https://i.pravatar.cc/150?u=kevin',
        linked_account_id: 'parent-problematic',
        // Missing medical info
    },
    {
        id: 'parent-exemplary',
        name: 'Maria Perfecta',
        email: 'maria@parent.com',
        role: 'parent',
        avatar: 'https://i.pravatar.cc/150?u=maria'
    },
    {
        id: 'parent-problematic',
        name: 'Sr. Desastre',
        email: 'sr@parent.com',
        role: 'parent',
        avatar: 'https://i.pravatar.cc/150?u=srdesastre'
    },
    {
        id: 'staff-1',
        name: 'Admin User',
        email: 'admin@learnandtravel.com',
        role: 'staff',
        avatar: 'https://i.pravatar.cc/150?u=staff-1'
    },
    {
        id: 'partner-1',
        name: 'Oxford Summer Courses',
        email: 'contact@oxford.com',
        role: 'partner',
        avatar: 'https://i.pravatar.cc/150?u=partner-1'
    }
];

export const MOCK_SCHOOLS: School[] = [
    {
        id: 'school-tec',
        name: 'Prepa Tec',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Tecnologico_de_Monterrey_seal.svg/1200px-Tecnologico_de_Monterrey_seal.svg.png',
        contactName: 'Director Juan Pérez',
        contactEmail: 'juan.perez@tec.mx',
        address: 'Av. Eugenio Garza Sada 2501'
    },
    {
        id: 'school-anahuac',
        name: 'Prepa Anáhuac',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Logo_Red_de_Universidades_An%C3%A1huac.svg/1200px-Logo_Red_de_Universidades_An%C3%A1huac.svg.png',
        contactName: 'Coord. María López',
        contactEmail: 'maria.lopez@anahuac.mx',
        address: 'Av. Universidad Anáhuac 46'
    }
];

export const MOCK_TRIPS: Trip[] = [
    {
        id: 'trip-london',
        internalId: 'P-2026-001',
        programId: 'trip-london', // Linked to the Program definition
        schoolId: 'school-tec',
        destination: 'London, UK',
        title: 'Summer English Immersion 2026',
        startDate: '2026-07-15',
        endDate: '2026-08-15',
        status: 'upcoming',
        price: 4500,
        image: '/images/university-program.jpg',
        programDetails: '<h3>Program Overview</h3><p>Experience London like a local...</p>'
    },
    {
        id: 'trip-vancouver',
        internalId: 'P-2026-002',
        programId: 'trip-vancouver',
        schoolId: 'school-anahuac',
        destination: 'Vancouver, Canada',
        title: 'Nature & Tech Camp 2025',
        startDate: '2025-07-10',
        endDate: '2025-08-01',
        status: 'upcoming',
        price: 3800,
        image: '/images/vancouver.jpg',
        programDetails: '<h3>Program Overview</h3><p>Explore the outdoors and learn coding...</p>'
    }
];

export const MOCK_DOCUMENTS: Document[] = [
    // Exemplary Student Docs (All Approved)
    { id: 'doc-e1', userId: 'student-exemplary', type: 'passport', name: 'Passport Scan', status: 'approved', url: '#', uploadedAt: '2025-11-01' },
    { id: 'doc-e2', userId: 'student-exemplary', type: 'visa', name: 'UK Student Visa', status: 'approved', url: '#', uploadedAt: '2025-11-10' },
    { id: 'doc-e3', userId: 'student-exemplary', type: 'form', name: 'Medical Consent', status: 'approved', url: '#', uploadedAt: '2025-11-05' },
    { id: 'doc-e4', userId: 'student-exemplary', type: 'rules', name: 'Code of Conduct', status: 'approved', url: '#', uploadedAt: '2025-11-05', requiresSignature: true, isSigned: true },

    // Problematic Student Docs (Issues)
    { id: 'doc-p1', userId: 'student-problematic', type: 'passport', name: 'Passport Scan', status: 'rejected', url: '#', uploadedAt: '2025-12-01', feedback: 'Image is blurry and expiration date is not visible.' },
    { id: 'doc-p2', userId: 'student-problematic', type: 'visa', name: 'UK Student Visa', status: 'pending', url: '#', uploadedAt: '' },
    { id: 'doc-p3', userId: 'student-problematic', type: 'rules', name: 'Code of Conduct', status: 'pending', url: '#', uploadedAt: '', requiresSignature: true, isSigned: false },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    // Exemplary Student (Paid up)
    { id: 'tx-e1', userId: 'student-exemplary', amount: 500, date: '2025-10-01', concept: 'Reservation Fee', status: 'paid', type: 'charge' },
    { id: 'tx-e2', userId: 'student-exemplary', amount: 500, date: '2025-10-01', concept: 'Reservation Payment', status: 'paid', type: 'payment' },
    { id: 'tx-e3', userId: 'student-exemplary', amount: 2000, date: '2025-11-01', concept: 'First Installment', status: 'paid', type: 'charge' },
    { id: 'tx-e4', userId: 'student-exemplary', amount: 2000, date: '2025-11-02', concept: 'First Installment Payment', status: 'paid', type: 'payment' },

    // Problematic Student (Overdue)
    { id: 'tx-p1', userId: 'student-problematic', amount: 500, date: '2025-10-01', concept: 'Reservation Fee', status: 'paid', type: 'charge' },
    { id: 'tx-p2', userId: 'student-problematic', amount: 500, date: '2025-10-05', concept: 'Reservation Payment', status: 'paid', type: 'payment' },
    { id: 'tx-p3', userId: 'student-problematic', amount: 2000, date: '2025-11-01', concept: 'First Installment', status: 'overdue', type: 'charge' },
];

export const MOCK_FLIGHTS: Flight[] = [
    {
        id: 'flight-1',
        tripId: 'trip-london',
        airline: 'British Airways',
        flightNumber: 'BA242',
        departureTime: '2026-07-15T18:00:00',
        arrivalTime: '2026-07-16T10:00:00',
        departureAirport: 'MEX',
        arrivalAirport: 'LHR',
        terminal: '5',
        type: 'outbound',
        category: 'Economy',
        seats: 'Group Block',
        cancellationPolicy: 'Non-refundable after May 15th, 2026.',
        notes: 'Please arrive 3 hours before departure. Group check-in counter will be open.'
    },
    {
        id: 'flight-2',
        tripId: 'trip-london',
        airline: 'British Airways',
        flightNumber: 'BA243',
        departureTime: '2026-08-15T12:00:00',
        arrivalTime: '2026-08-15T18:00:00',
        departureAirport: 'LHR',
        arrivalAirport: 'MEX',
        terminal: '5',
        type: 'return',
        category: 'Economy',
        seats: 'Group Block',
        cancellationPolicy: 'Non-refundable.',
        notes: 'Transfer from campus to airport is included.'
    }
];

export const MOCK_ACCOMMODATIONS: Accommodation[] = [
    {
        id: 'acc-1',
        tripId: 'trip-london',
        type: 'residence',
        name: 'Chapter Spitalfields',
        address: '9 Frying Pan Alley, London E1 7HS',
        contactPhone: '+44 20 7293 0000',
        roommate: 'Diego Rivera',
        details: 'Single en-suite room in shared flat.'
    }
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'act-1', tripId: 'trip-london', title: 'Arrival & Welcome Dinner', date: '2026-07-16', time: '19:00', description: 'Meet the staff and other students.', type: 'leisure' },
    { id: 'act-2', tripId: 'trip-london', title: 'English Class: Placement Test', date: '2026-07-17', time: '09:00', description: 'Assessment of English level.', type: 'class' },
    { id: 'act-3', tripId: 'trip-london', title: 'London Eye Excursion', date: '2026-07-17', time: '14:00', description: 'Visit the iconic London Eye.', type: 'excursion' },
];

export const MOCK_RESOURCES: Resource[] = [
    { id: 'res-1', title: 'How to Pack for London', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }, // Placeholder
    { id: 'res-2', title: 'Packing List.pdf', type: 'pdf', url: '#' },
    { id: 'res-3', title: 'Basic Vocabulary.pdf', type: 'pdf', url: '#' },
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'msg-1', userId: 'student-exemplary', sender: 'staff', text: 'Welcome to the platform, Valentina!', timestamp: '2025-10-01T10:00:00', read: true },
    { id: 'msg-2', userId: 'student-exemplary', sender: 'user', text: 'Thank you! I am excited.', timestamp: '2025-10-01T10:05:00', read: true },
    { id: 'msg-3', userId: 'student-problematic', sender: 'staff', text: 'Hi Kevin, please upload your passport.', timestamp: '2025-11-15T09:00:00', read: false },
];

export const MOCK_LEADS: Lead[] = [
    { id: 'lead-1', internalId: 'S-2025-001', name: 'Sofia Martinez', email: 'sofia@gmail.com', phone: '5512345678', programId: 'trip-london', status: 'new', createdAt: '2025-12-01', source: 'Instagram' },
    { id: 'lead-2', internalId: 'S-2025-002', name: 'Mateo Gonzalez', email: 'mateo@hotmail.com', phone: '5587654321', programId: 'trip-vancouver', status: 'contacted', createdAt: '2025-11-28', source: 'School Fair' },
    { id: 'lead-3', internalId: 'S-2025-003', name: 'Camila Rodriguez', email: 'camila@yahoo.com', phone: '5511223344', programId: 'trip-london', status: 'interested', createdAt: '2025-11-25', source: 'Referral' },
];

export const MOCK_PROVIDERS: Provider[] = [
    { id: 'prov-1', name: 'British Airways', type: 'transport', contactName: 'Support Team', contactEmail: 'groups@ba.com', contactPhone: '+44 20 1234 5678', website: 'https://ba.com' },
    { id: 'prov-2', name: 'Chapter Living', type: 'accommodation', contactName: 'Sarah Smith', contactEmail: 'sales@chapter.com', contactPhone: '+44 20 8765 4321', website: 'https://chapter-living.com' },
    { id: 'prov-3', name: 'AIG Insurance', type: 'insurance', contactName: 'Agent Mike', contactEmail: 'mike@aig.com', contactPhone: '+1 800 123 4567', website: 'https://aig.com' },
];

export const MOCK_AGREEMENTS: Agreement[] = [
    { id: 'agr-1', providerId: 'prov-2', title: 'Summer 2026 Housing Contract', validFrom: '2026-01-01', validTo: '2026-12-31', status: 'active', url: '#' },
    { id: 'agr-2', providerId: 'prov-1', title: 'Group Flight Block 2026', validFrom: '2025-11-01', validTo: '2026-08-01', status: 'active', url: '#' },
];

export const MOCK_LOGS: ActivityLog[] = [
    { id: 'log-1', userId: 'staff-1', action: 'Approved Document', targetId: 'doc-e1', targetType: 'document', timestamp: '2025-11-02T10:00:00', details: 'Passport approved for Valentina.' },
    { id: 'log-2', userId: 'staff-1', action: 'Updated Price', targetId: 'trip-london', targetType: 'trip', timestamp: '2025-10-15T14:30:00', details: 'Price increased by $100.' },
    { id: 'log-3', userId: 'staff-1', action: 'Created Lead', targetId: 'lead-1', targetType: 'student', timestamp: '2025-12-01T09:15:00', details: 'Manual lead entry from Instagram DM.' },
];

// --- STAFF MODULE NEW INTERFACES & DATA ---

export type Priority = 'normal' | 'high' | 'critical';
export type HealthStatus = 'green' | 'yellow' | 'red';

export interface Note {
    id: string;
    content: string;
    type: 'call' | 'email' | 'internal_note';
    priority: Priority;
    createdAt: string; // ISO String
    author: string;
}

export interface Contact {
    id: string;
    internalId?: string; // New field
    name: string;
    email: string;
    role: 'student' | 'parent' | 'partner';
    organization: string; // Nombre de la escuela o empresa
    programInterest: string; // ID del viaje
    status: 'lead' | 'interested' | 'applied' | 'enrolled';
    healthStatus: HealthStatus; // Calculado basado en la nota más reciente
    timeline: Note[];
}

export interface Plan {
    name: string;
    price: number;
    deadline?: string;
    status?: 'active' | 'hidden' | 'sold_out';
}

export interface Program {
    id: string;
    internalId?: string; // New field
    title: string;
    slug: string; // para la url
    destination: string;
    price: number;
    currency: 'USD' | 'MXN';
    status: 'draft' | 'published';
    image: string;
    itinerary: { day: number; title: string; description: string }[];
    flights: Flight[]; // New field
    inclusions: string[]; // Lista de strings
    plans?: Plan[];
}

export interface BusinessTransaction {
    id: string;
    date: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    status: 'pending' | 'completed' | 'cancelled';
    relatedId?: string; // ID of student or invoice
}

export interface Invoice {
    id: string;
    providerId: string;
    programId: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    description: string;
}

export interface InventoryCost {
    programId: string;
    item: string;
    costPerUnit: number;
    quantity: number;
    totalCost: number;
}

// SEED DATA

export const MOCK_BUSINESS_TRANSACTIONS: BusinessTransaction[] = [
    { id: 'tx-1', date: '2025-12-01', amount: 5000, type: 'income', category: 'Tuition', description: 'Payment from Pedro Pérez', status: 'completed', relatedId: 'contact-critical' },
    { id: 'tx-2', date: '2025-12-02', amount: 1500, type: 'expense', category: 'Marketing', description: 'Facebook Ads', status: 'completed' },
    { id: 'tx-3', date: '2025-12-05', amount: 12000, type: 'expense', category: 'Flights', description: 'Group Flight Deposit', status: 'pending' },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'inv-1', providerId: 'prov-1', programId: 'prog-vancouver', amount: 12000, dueDate: '2025-12-15', status: 'pending', description: 'Flight Deposit 30 Pax' },
    { id: 'inv-2', providerId: 'prov-2', programId: 'prog-vancouver', amount: 8000, dueDate: '2026-01-10', status: 'pending', description: 'Homestay Reservation' },
];

export const MOCK_INVENTORY_COSTS: InventoryCost[] = [
    { programId: 'prog-vancouver', item: 'Flight', costPerUnit: 800, quantity: 30, totalCost: 24000 },
    { programId: 'prog-vancouver', item: 'Homestay', costPerUnit: 300, quantity: 30, totalCost: 9000 },
    { programId: 'prog-vancouver', item: 'Tuition', costPerUnit: 500, quantity: 30, totalCost: 15000 },
];

export const MOCK_CONTACTS: Contact[] = [
    {
        id: 'contact-critical',
        internalId: 'S-2025-004',
        name: 'Kevin Desastre',
        email: 'kevin@bad.com',
        role: 'student',
        organization: 'Prepa Tec',
        programInterest: 'trip-vancouver',
        status: 'applied',
        healthStatus: 'red',
        timeline: [
            {
                id: 'note-1',
                content: 'Visa Rechazada',
                type: 'internal_note',
                priority: 'critical',
                createdAt: '2025-12-01T10:00:00Z',
                author: 'Admin User'
            }
        ]
    },
    {
        id: 'contact-normal',
        internalId: 'S-2025-006',
        name: 'Ana López',
        email: 'ana@example.com',
        role: 'student',
        organization: 'Prepa Anáhuac',
        programInterest: 'trip-london',
        status: 'lead',
        healthStatus: 'green',
        timeline: []
    },
    {
        id: 'contact-interested',
        internalId: 'S-2025-007',
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        role: 'parent',
        organization: 'Empresa X',
        programInterest: 'trip-london',
        status: 'interested',
        healthStatus: 'yellow',
        timeline: [
            {
                id: 'note-2',
                content: 'Dudas sobre el seguro médico',
                type: 'call',
                priority: 'high',
                createdAt: '2025-12-02T15:30:00Z',
                author: 'Admin User'
            }
        ]
    },
    {
        id: 'contact-enrolled-1',
        name: 'Lucía Méndez',
        email: 'lucia@example.com',
        role: 'student',
        organization: 'Prepa Tec',
        programInterest: 'trip-vancouver',
        status: 'enrolled',
        healthStatus: 'green',
        timeline: []
    },
    {
        id: 'contact-enrolled-2',
        name: 'Jorge Treviño',
        email: 'jorge@example.com',
        role: 'student',
        organization: 'Prepa Tec',
        programInterest: 'trip-vancouver',
        status: 'enrolled',
        healthStatus: 'green',
        timeline: []
    }
];

export const MOCK_PROGRAMS: Program[] = [
    {
        id: "84-ORL2026",
        internalId: "84-ORL2026",
        slug: "orlando-business-2026",
        title: "The Way to Do Business - Orlando ABRIL 2026",
        destination: "Orlando, Florida",
        price: 2950,
        currency: 'USD',
        status: 'published',
        image: '/images/orlando-blueprint.png',
        plans: [
            { name: "Apartado (Reserva tu lugar)", price: 50, status: 'active' },
            { name: "Pago de Contado (Total $2,850)", price: 2850, deadline: "2026-01-20", status: 'active' },
            { name: "1er Pago (Plan Diferido)", price: 1000, deadline: "2026-01-20", status: 'active' },
            { name: "2do Pago (Plan Diferido)", price: 1000, deadline: "2026-02-20", status: 'active' },
            { name: "3er Pago (Plan Diferido)", price: 1000, deadline: "2026-03-20", status: 'active' }
        ],
        itinerary: [],
        flights: [],
        inclusions: []
    }
];
