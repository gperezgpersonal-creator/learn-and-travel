import { supabase } from '@/lib/supabase';
import { Program } from '@/services/mock/mockData';

// Map Supabase Row to App Program Interface
const mapRowToProgram = (row: any): Program => ({
    id: row.id,
    internalId: row.internal_id || row.id,
    slug: row.slug,
    title: row.title,
    destination: row.destination,
    price: row.price,
    currency: row.currency || 'USD',
    status: row.status,
    // Force override for Orlando 2026 to match Hero branding
    image: (row.id === '84-ORL2026' || row.slug === 'orlando-business-2026')
        ? '/images/orlando-logo-text.jpg'
        : (row.image || row.image_url),
    plans: row.plans_json || [], // Assuming 'plans' is stored as JSONB
    itinerary: [], // Not managed here anymore
    flights: [],
    inclusions: []
});

export const ProgramService = {
    // Get all programs
    getAll: async (): Promise<Program[]> => {
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching programs:', error);
            // Fallback for demo if table missing or empty (optional, removed for strict prod mode but kept simple for now)
            return [];
        }

        return data.map(mapRowToProgram);
    },

    // Create a new program (basic info)
    create: async (program: Partial<Program>): Promise<Program | null> => {
        const { data, error } = await supabase
            .from('programs')
            .insert({
                id: program.id, // User provided or auto-generated if omitted (but we want user provided ID usually?)
                internal_id: program.id, // Using PK as internal ID by default
                title: program.title,
                slug: program.title?.toLowerCase().replace(/\s+/g, '-') || 'new-program',
                destination: 'TBD', // Default
                price: 0,
                plans_json: [],
                status: 'draft'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating program:', error);
            throw error;
        }

        return mapRowToProgram(data);
    },

    // Update program (pricing, plans, etc.)
    update: async (id: string, updates: Partial<Program>): Promise<Program | null> => {
        // Prepare DB object
        const dbUpdates: any = {};
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
        if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
        if (updates.plans !== undefined) dbUpdates.plans_json = updates.plans;
        if (updates.status !== undefined) dbUpdates.status = updates.status;

        const { data, error } = await supabase
            .from('programs')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error) {
                console.error('Error updating program ID:', id);
                console.error('Supabase Error Details:', JSON.stringify(error, null, 2));
                throw error;
            }
        }

        return mapRowToProgram(data);
    },

    // Get program by slug (for public page)
    getBySlug: async (slug: string): Promise<Program | null> => {
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            console.warn('Error fetching program by slug:', slug, error);
            return null;
        }

        return mapRowToProgram(data);
    },

    // Get program by ID (Robust link)
    getById: async (id: string): Promise<Program | null> => {
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            console.warn('Error fetching program by ID:', id, error);
            return null;
        }

        return mapRowToProgram(data);
    }
};
