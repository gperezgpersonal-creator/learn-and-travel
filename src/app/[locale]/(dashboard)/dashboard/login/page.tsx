'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import Image from 'next/image';
import { authService } from '@/services/mock/authService';
import { UserRole } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (role: UserRole) => {
        setIsLoading(true);
        try {
            const { user } = await authService.login(role);
            // In a real app, we would store the token in cookies/localStorage
            console.log('Logged in as:', user);

            // Redirect based on role
            if (role === 'student' || role === 'parent') {
                router.push('/dashboard/student');
            } else if (role === 'staff') {
                router.push('/dashboard/admin');
            } else if (role === 'partner') {
                router.push('/dashboard/partner');
            }
        } catch (error) {
            console.error('Login failed', error);
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
                        <h1 className="text-2xl font-serif font-bold text-primary mb-2">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Sign in to access your dashboard</p>
                    </div>

                    <div className="p-8 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                disabled
                            />
                        </div>

                        <button
                            className="w-full btn btn-primary py-3 mt-4 opacity-50 cursor-not-allowed"
                            disabled
                        >
                            Sign In
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Dev Mode Access</span>
                            </div>
                        </div>

                        {/* DevBar for Role Switching */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleLogin('student')}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                                {isLoading ? '...' : 'Student Demo'}
                            </button>
                            <button
                                onClick={() => handleLogin('parent')}
                                disabled={isLoading}
                                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                            >
                                {isLoading ? '...' : 'Parent Demo'}
                            </button>
                            <button
                                onClick={() => handleLogin('staff')}
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                                {isLoading ? '...' : 'Staff Demo'}
                            </button>
                            <button
                                onClick={() => handleLogin('partner')}
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                            >
                                {isLoading ? '...' : 'Partner Demo'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 text-center text-xs text-slate-400">
                        &copy; 2025 Learn and Travel. All rights reserved.
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
