'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import Image from 'next/image';
import { supabaseAuthService } from '@/services/supabase/auth';
import FadeIn from '@/components/ui/FadeIn';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { user, error: loginError } = await supabaseAuthService.login(email, password);

            if (loginError) {
                setError(loginError);
                return;
            }

            if (!user) {
                setError('No user returned');
                return;
            }

            // Redirect based on role
            if (user.role === 'staff') {
                router.push('/dashboard/admin');
            } else {
                setError('Access restricted to Staff members.');
            }

        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.message || 'Error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <FadeIn>
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    <div className="p-8 text-center border-b border-slate-100">
                        <div className="relative w-32 h-12 mx-auto mb-6">
                            <Image
                                src="/logo.png"
                                alt="Learn and Travel"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-primary mb-2">Staff Access</h1>
                        <p className="text-slate-500 text-sm">Sign in to manage the platform</p>
                    </div>

                    <form onSubmit={handleLogin} className="p-8 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full btn btn-primary py-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="bg-slate-50 p-4 text-center text-xs text-slate-400">
                        &copy; 2025 Learn and Travel. All rights reserved.
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
