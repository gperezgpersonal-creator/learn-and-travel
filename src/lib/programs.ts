export type Program = {
    id: string;
    title: string;
    type: 'language' | 'university' | 'educational' | 'camp' | 'internship' | 'custom';
    country: string;
    city: string;
    dates: string;
    status: 'available' | 'coming_soon' | 'private';
    summary: string;
    image: string;
    ageGroup: '15-18' | '18-25' | 'all';
    description?: string;
    price?: string;
    itinerary?: { day: number; title: string; description: string }[];
    inclusions?: string[];
    exclusions?: string[];
};

export const programs: Program[] = [
    {
        id: '1',
        title: 'Silicon Valley Tech Tour',
        type: 'educational',
        country: 'USA',
        city: 'San Francisco',
        dates: 'Jul 15 - Jul 25, 2026',
        status: 'available',
        summary: 'Visit top tech companies like Google, Apple, and Meta. Learn about innovation and entrepreneurship.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
        ageGroup: '18-25',
        description: 'Immerse yourself in the world center of technology and innovation. This program is designed for students passionate about tech, entrepreneurship, and the future.',
        price: '$4,500 USD',
        itinerary: [
            { day: 1, title: 'Arrival & Welcome', description: 'Arrive in San Francisco, hotel check-in, and welcome dinner.' },
            { day: 2, title: 'Google Campus', description: 'Exclusive tour of the Googleplex and Q&A with engineers.' },
            { day: 3, title: 'Stanford University', description: 'Workshop on Design Thinking at d.school.' },
            { day: 4, title: 'Meta HQ', description: 'Visit Meta headquarters and learn about the Metaverse.' },
            { day: 5, title: 'Startup Pitch', description: 'Visit a startup accelerator and pitch your own ideas.' }
        ],
        inclusions: ['Accommodation', 'Breakfast & Dinner', 'All transportation', 'Entrance fees', 'Workshops'],
        exclusions: ['International flights', 'Lunch', 'Personal expenses']
    },
    {
        id: '2',
        title: 'Oxford Summer Academy',
        type: 'university',
        country: 'UK',
        city: 'Oxford',
        dates: 'Aug 01 - Aug 15, 2026',
        status: 'available',
        summary: 'Experience life as an Oxford student. Attend lectures, explore historic colleges, and improve your academic skills.',
        image: 'https://images.unsplash.com/photo-1590089415225-401eb6b9e9e2?q=80&w=2069&auto=format&fit=crop',
        ageGroup: '15-18',
        description: 'Live and learn in one of the world\'s most prestigious university cities. This program offers a unique blend of academic rigor and cultural immersion.',
        price: '£3,800 GBP',
        itinerary: [
            { day: 1, title: 'Arrival in Oxford', description: 'Check-in to college dorms and orientation.' },
            { day: 2, title: 'Academic Lectures', description: 'Morning lectures by Oxford professors.' },
            { day: 3, title: 'Punting on the Cherwell', description: 'Traditional punting experience and picnic.' },
            { day: 4, title: 'London Day Trip', description: 'Visit museums and historical sites in London.' },
            { day: 5, title: 'Debate Workshop', description: 'Learn the art of debating at the Oxford Union.' }
        ],
        inclusions: ['Dorm accommodation', 'Full board meals', 'Tuition & Materials', 'Excursions'],
        exclusions: ['Flights', 'Visa fees', 'Travel insurance']
    },
    {
        id: '3',
        title: 'Tokyo Cultural Immersion',
        type: 'language',
        country: 'Japan',
        city: 'Tokyo',
        dates: 'Jun 10 - Jun 24, 2026',
        status: 'coming_soon',
        summary: 'Learn Japanese language and culture in the heart of Tokyo. Traditional arts, modern technology, and homestay.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2070&auto=format&fit=crop',
        ageGroup: 'all'
    },
    {
        id: '4',
        title: 'Startup Internship in Tel Aviv',
        type: 'internship',
        country: 'Israel',
        city: 'Tel Aviv',
        dates: 'Sep 01 - Nov 30, 2026',
        status: 'private',
        summary: 'Work with cutting-edge startups in the "Startup Nation". Gain hands-on experience in tech and business.',
        image: 'https://images.unsplash.com/photo-1544971587-b842c27f8e14?q=80&w=2070&auto=format&fit=crop',
        ageGroup: '18-25'
    },
    {
        id: '5',
        title: 'Leadership Camp in Canada',
        type: 'camp',
        country: 'Canada',
        city: 'Vancouver',
        dates: 'Jul 05 - Jul 19, 2026',
        status: 'available',
        summary: 'Develop leadership skills through outdoor activities and workshops in the beautiful Canadian wilderness.',
        image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2070&auto=format&fit=crop',
        ageGroup: '15-18'
    }
];
