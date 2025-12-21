import { supabase } from '@/lib/supabase';

// Re-defining interface to match the application usage
export interface QuoteVersion {
    id: string;
    name: string;          // Version Name
    programCode: string;   // Program ID/Slug
    city: string;
    dates: string;
    timestamp: number;
    finalPrice: number;    // Usually Single Occupancy Price
    priceDbl: number;      // Double Occupancy Price
    summary: string;
    data: any;             // Full State JSON
    clientName?: string;   // New field, visible in history
}

export const QuoteService = {
    // Save a new version
    saveVersion: async (
        name: string,
        programCode: string,
        city: string,
        dates: string,
        data: any,
        finalPrice: number,
        priceDbl: number,
        summary: string
    ): Promise<QuoteVersion | null> => {

        const clientName = data.headerInfo?.profesorResponsable || 'Cliente General';
        const user = await supabase.auth.getUser();

        try {
            const { data: inserted, error } = await supabase
                .from('quotes')
                .insert({
                    program_slug: programCode || 'Sin Código',
                    client_name: clientName,
                    version_name: name,
                    city: city || '',
                    dates: dates || '',
                    total_price: finalPrice,
                    price_dbl: priceDbl,
                    summary: summary,
                    data_json: data,
                    created_by: user.data.user?.id // Will be null if auth setup is weird, but RLS handles it
                })
                .select()
                .single();

            if (error) {
                console.error('Error saving quote to Supabase:', error);
                throw error;
            }

            return {
                id: inserted.id,
                name: inserted.version_name,
                programCode: inserted.program_slug,
                city: inserted.city,
                dates: inserted.dates,
                timestamp: new Date(inserted.created_at).getTime(),
                finalPrice: inserted.total_price,
                priceDbl: inserted.price_dbl,
                summary: inserted.summary,
                data: inserted.data_json,
                clientName: inserted.client_name
            };

        } catch (err) {
            console.error(err);
            return null;
        }
    },

    // Get all versions
    getVersions: async (programCode?: string): Promise<QuoteVersion[]> => {
        try {
            let query = supabase
                .from('quotes')
                .select('*')
                .order('created_at', { ascending: false });

            if (programCode) {
                query = query.ilike('program_slug', `%${programCode}%`);
            }

            const { data, error } = await query;

            if (error) throw error;

            return (data || []).map(row => ({
                id: row.id,
                name: row.version_name,
                programCode: row.program_slug,
                city: row.city,
                dates: row.dates,
                timestamp: new Date(row.created_at).getTime(),
                finalPrice: row.total_price,
                priceDbl: row.price_dbl,
                summary: row.summary,
                data: row.data_json,
                clientName: row.client_name
            }));
        } catch (err) {
            console.error('Error fetching quotes:', err);
            return [];
        }
    },

    // Delete a version
    deleteVersion: async (id: string) => {
        try {
            const { error } = await supabase
                .from('quotes')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting quote:', err);
        }
    }
};
