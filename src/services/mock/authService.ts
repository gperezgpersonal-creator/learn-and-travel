import { MOCK_USERS, User, UserRole } from './mockData';

export const authService = {
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Find user by email (case-insensitive)
        const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Validate password (mock check)
        // In a real scenario this would be a hash check. 
        // For this local mock, we'll use a simple rule or a default password.
        const trimmedPassword = password.trim();

        if (trimmedPassword !== 'admin123') { // Default password for all mock users for now
            throw new Error('Invalid credentials');
        }

        // Enforce Staff Only (per requirement)
        if (user.role !== 'staff') {
            throw new Error('Access restricted to Staff members only.');
        }

        return {
            user,
            token: `mock-token-${user.id}-${Date.now()}`
        };
    },

    logout: async (): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
    },

    getCurrentUser: async (userId: string): Promise<User | null> => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return MOCK_USERS.find((u) => u.id === userId) || null;
    }
};
