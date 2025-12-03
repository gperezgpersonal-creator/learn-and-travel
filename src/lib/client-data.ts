export type ClientTrip = {
    id: string;
    programId: string;
    title: string;
    dates: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    destination: string;
    image: string;
    documents: ClientDocument[];
};

export type ClientDocument = {
    id: string;
    name: string;
    type: 'pdf' | 'image';
    status: 'uploaded' | 'pending';
    date: string;
};

export type ClientMessage = {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    date: string;
    read: boolean;
};

export const clientMessages: ClientMessage[] = [
    {
        id: 'm1',
        sender: 'Learn and Travel Support',
        subject: 'Welcome to your Client Portal',
        preview: 'Hi there! We are excited to have you on board. Here is a quick guide to using your new dashboard...',
        date: 'Dec 01, 2025',
        read: true
    },
    {
        id: 'm2',
        sender: 'Sarah Jenkins',
        subject: 'Flight Itinerary Update',
        preview: 'Please note that there has been a slight change to your return flight time. See attached details...',
        date: 'Dec 12, 2025',
        read: false
    },
    {
        id: 'm3',
        sender: 'Finance Team',
        subject: 'Payment Confirmation',
        preview: 'We have received your payment for the Silicon Valley Tech Tour. Thank you!',
        date: 'Dec 15, 2025',
        read: false
    }
];

export type ClientPayment = {
    id: string;
    concept: string;
    amount: string;
    date: string;
    status: 'paid' | 'pending';
};

export const clientPayments: ClientPayment[] = [
    { id: 'p1', concept: 'Deposit - Silicon Valley Tech Tour', amount: '$500 USD', date: 'Nov 15, 2025', status: 'paid' },
    { id: 'p2', concept: 'Installment 1 - Silicon Valley Tech Tour', amount: '$1,500 USD', date: 'Dec 15, 2025', status: 'paid' },
    { id: 'p3', concept: 'Installment 2 - Silicon Valley Tech Tour', amount: '$1,500 USD', date: 'Jan 15, 2026', status: 'pending' },
    { id: 'p4', concept: 'Final Balance - Silicon Valley Tech Tour', amount: '$1,000 USD', date: 'Feb 15, 2026', status: 'pending' },
];

export type ClientResource = {
    id: string;
    title: string;
    type: 'pdf' | 'link' | 'checklist';
    description: string;
};

export const clientResources: ClientResource[] = [
    { id: 'r1', title: 'Pre-departure Checklist', type: 'checklist', description: 'Essential items to pack and prepare.' },
    { id: 'r2', title: 'San Francisco City Guide', type: 'pdf', description: 'Top attractions, restaurants, and tips.' },
    { id: 'r3', title: 'Visa Application Guide', type: 'link', description: 'Step-by-step instructions for US visa.' },
    { id: 'r4', title: 'Emergency Contacts', type: 'pdf', description: 'Important numbers and addresses.' },
];

export const clientTrips: ClientTrip[] = [
    {
        id: '1',
        programId: '1',
        title: 'Silicon Valley Tech Tour',
        dates: 'Jul 15 - Jul 25, 2026',
        status: 'upcoming',
        destination: 'San Francisco, USA',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
        documents: [
            { id: 'd1', name: 'Passport Scan', type: 'image', status: 'uploaded', date: 'Dec 10, 2025' },
            { id: 'd2', name: 'Visa Approval', type: 'pdf', status: 'pending', date: '-' },
            { id: 'd3', name: 'Flight Itinerary', type: 'pdf', status: 'pending', date: '-' },
            { id: 'd4', name: 'Parental Consent', type: 'pdf', status: 'uploaded', date: 'Dec 12, 2025' },
        ]
    },
    {
        id: '2',
        programId: '2',
        title: 'London Cultural Trip',
        dates: 'Aug 10 - Aug 20, 2024',
        status: 'completed',
        destination: 'London, UK',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
        documents: [
            { id: 'd5', name: 'Certificate of Completion', type: 'pdf', status: 'uploaded', date: 'Aug 25, 2024' },
        ]
    }
];
