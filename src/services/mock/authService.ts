import { MOCK_USERS, User, UserRole } from './mockData';

export const authService = {
    login: async (role: UserRole): Promise<{ user: User; token: string }> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const user = MOCK_USERS.find((u) => u.role === role);
        if (!user) {
            throw new Error('User not found for this role');
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
