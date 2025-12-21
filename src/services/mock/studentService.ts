import {
    MOCK_USERS,
    MOCK_TRIPS,
    MOCK_DOCUMENTS,
    MOCK_TRANSACTIONS,
    MOCK_FLIGHTS,
    MOCK_ACCOMMODATIONS,
    MOCK_ACTIVITIES,
    MOCK_PROGRAMS,
    User,
    Trip,
    Document,
    Transaction,
    Flight,
    Accommodation,
    Activity,
    Resource,
    MOCK_RESOURCES,
    Message,
    MOCK_MESSAGES,
    Program
} from './mockData';

export const studentService = {
    getTrip: async (tripId: string): Promise<Trip | null> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // For demo purposes, we just return the first trip or the specific one
        return MOCK_TRIPS.find((t) => t.id === tripId) || MOCK_TRIPS[0];
    },

    getProgram: async (programId: string): Promise<Program | null> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_PROGRAMS.find((p) => p.id === programId) || null;
    },

    getDocuments: async (userId: string): Promise<Document[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_DOCUMENTS.filter((d) => d.userId === userId);
    },

    uploadDocument: async (userId: string, type: Document['type'], file: File): Promise<Document> => {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate upload delay
        const newDoc: Document = {
            id: `doc - ${Date.now()} `,
            userId,
            type,
            name: file.name,
            status: 'review',
            url: '#',
            uploadedAt: new Date().toISOString().split('T')[0]
        };
        return newDoc;
    },

    getTransactions: async (userId: string): Promise<Transaction[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_TRANSACTIONS.filter((t) => t.userId === userId);
    },

    getFlights: async (tripId: string): Promise<Flight[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_FLIGHTS.filter((f) => f.tripId === tripId);
    },

    getAccommodation: async (tripId: string): Promise<Accommodation | null> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_ACCOMMODATIONS.find((a) => a.tripId === tripId) || null;
    },

    getActivities: async (tripId: string): Promise<Activity[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_ACTIVITIES.filter((a) => a.tripId === tripId).sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
    },

    getResources: async (): Promise<Resource[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_RESOURCES;
    },

    getMessages: async (userId: string): Promise<Message[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_MESSAGES.filter(m => m.userId === userId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },

    sendMessage: async (userId: string, text: string): Promise<Message> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            id: `msg - ${Date.now()} `,
            userId,
            sender: 'user',
            text,
            timestamp: new Date().toISOString(),
            read: true
        };
    }
};
