import {
    MOCK_USERS,
    MOCK_TRIPS,
    MOCK_DOCUMENTS,
    MOCK_TRANSACTIONS,
    MOCK_LOGS,
    MOCK_LEADS,
    MOCK_MESSAGES,
    MOCK_SCHOOLS,
    User,
    Trip,
    Document,
    Transaction,
    ActivityLog,
    Lead,
    Message,
    School
} from './mockData';

export const adminService = {
    // ... existing methods ...
    getStats: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            totalStudents: MOCK_USERS.filter(u => u.role === 'student').length,
            activeTrips: MOCK_TRIPS.filter(t => t.status === 'active').length,
            revenue: MOCK_TRANSACTIONS.filter(t => t.type === 'charge' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0),
            pendingDocs: MOCK_DOCUMENTS.filter(d => d.status === 'review').length
        };
    },

    getDashboardKPIs: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const totalSales = MOCK_TRANSACTIONS.filter(t => t.type === 'charge' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
        const enrolledStudents = MOCK_USERS.filter(u => u.role === 'student').length;
        const goal = 100; // Mock goal
        const paymentsToday = 1500; // Mock value

        return {
            sales: totalSales,
            enrollment: enrolledStudents,
            enrollmentGoal: goal,
            paymentsToday: paymentsToday
        };
    },

    getPendingItems: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            documents: MOCK_DOCUMENTS.filter(d => d.status === 'review').length,
            payments: MOCK_TRANSACTIONS.filter(t => t.status === 'pending' && t.type === 'payment').length, // Manual payments to reconcile
            messages: MOCK_MESSAGES.filter(m => !m.read && m.sender === 'user').length
        };
    },

    getUpcomingDepartures: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Return trips starting in next 30 days (mock logic, just returns all upcoming)
        return MOCK_TRIPS.filter(t => t.status === 'upcoming').sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    },

    getRecentLogs: async (): Promise<ActivityLog[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_LOGS.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    getStudents: async (): Promise<User[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_USERS.filter((u) => u.role === 'student');
    },

    getLeads: async (): Promise<Lead[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_LEADS;
    },

    getPendingDocuments: async (): Promise<Document[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_DOCUMENTS.filter((d) => d.status === 'review');
    },

    updateDocumentStatus: async (docId: string, status: Document['status'], feedback?: string): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const docIndex = MOCK_DOCUMENTS.findIndex((d) => d.id === docId);
        if (docIndex !== -1) {
            MOCK_DOCUMENTS[docIndex].status = status;
            if (feedback) MOCK_DOCUMENTS[docIndex].feedback = feedback;
        }
    },

    // NEW CRM METHODS
    getSchools: async (): Promise<School[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_SCHOOLS;
    },

    getSchoolPrograms: async (schoolId: string): Promise<Trip[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_TRIPS.filter(t => t.schoolId === schoolId);
    },

    getProgramStudents: async (programId: string): Promise<User[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // In a real app we'd have a link table, here we just return all students for demo
        // or filter if we added programId to User. Let's just return all students for now to populate the list.
        return MOCK_USERS.filter(u => u.role === 'student');
    },

    getProgramLeads: async (programId: string): Promise<Lead[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_LEADS.filter(l => l.programId === programId);
    }
};
