export interface ProgramTypeContent {
    id: string;
    slug: string;
    heroImage: string;
    images?: string[]; // For gallery or featured section
}

export const PROGRAM_TYPES: ProgramTypeContent[] = [
    {
        id: '1',
        slug: 'idiomas',
        heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '2',
        slug: 'universitarios',
        heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '3',
        slug: 'experiencias',
        heroImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1920&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '4',
        slug: 'campamentos',
        heroImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1920&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1534598485943-9d5ae79d730d?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '5',
        slug: 'pasantias',
        heroImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '6',
        slug: 'a-medida',
        heroImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1920&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'
        ]
    }
];
