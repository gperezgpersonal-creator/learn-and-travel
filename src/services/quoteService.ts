

export interface QuoteVersion {
    id: string;
    name: string;
    programCode: string;
    city: string;
    dates: string;
    timestamp: number;
    finalPrice: number;
    priceDbl: number;       // New: Standard Double Occupancy Price
    summary: string;        // New: Included items summary
    data: any;
}

const STORAGE_KEY = 'lt_quote_versions';

export const QuoteService = {
    // Save a new version
    saveVersion: (name: string, programCode: string, city: string, dates: string, data: any, finalPrice: number, priceDbl: number, summary: string): QuoteVersion => {
        const versions = QuoteService.getVersions();
        const newVersion: QuoteVersion = {
            id: crypto.randomUUID(),
            name,
            programCode: programCode || 'Sin Código',
            city: city || '',
            dates: dates || '',
            timestamp: Date.now(),
            data,
            finalPrice,
            priceDbl,
            summary
        };
        versions.push(newVersion);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
        return newVersion;
    },

    // Get all versions (optionally filtered by program)
    getVersions: (programCode?: string): QuoteVersion[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        try {
            const parsed: QuoteVersion[] = JSON.parse(stored);
            if (programCode) {
                // Filter by program code (loose match)
                return parsed.filter(v =>
                    v.programCode.toLowerCase().includes(programCode.toLowerCase())
                ).sort((a, b) => b.timestamp - a.timestamp);
            }
            return parsed.sort((a, b) => b.timestamp - a.timestamp);
        } catch (e) {
            console.error("Error parsing versions", e);
            return [];
        }
    },

    // Delete a version
    deleteVersion: (id: string) => {
        const versions = QuoteService.getVersions();
        const filtered = versions.filter(v => v.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
};
