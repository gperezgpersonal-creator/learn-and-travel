import { supabase } from '@/lib/supabase';
import { User } from '@/services/mock/mockData'; // Using our unified User type

export const supabaseAuthService = {
    login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
        try {
            // 1. Authenticate with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('No user returned');

            // 2. Fetch User Profile (Role, Name, etc.)
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (profileError || !profileData) {
                console.error('Error fetching profile:', profileError);
                return { user: null, error: 'Profile not found. Please contact support.' };
            }

            // 3. Map to our User Interface
            const user: User = {
                id: profileData.id,
                email: profileData.email,
                name: profileData.full_name || 'Usuario',
                role: profileData.role as any,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name || 'U')}&background=0D8ABC&color=fff`
            };

            return { user, error: null };

        } catch (error: any) {
            console.error('Login error:', error.message);
            return { user: null, error: error.message || 'Error al iniciar sesión' };
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
    },

    getCurrentUser: async (): Promise<User | null> => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (!profile) return null;

        return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || 'Usuario',
            role: profile.role as any,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'U')}&background=0D8ABC&color=fff`
        };
    }
};
