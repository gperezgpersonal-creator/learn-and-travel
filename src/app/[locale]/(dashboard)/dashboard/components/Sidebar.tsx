'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import { Home, FileText, CreditCard, User, Settings, LogOut, Users, Briefcase, Map, BookOpen, MessageSquare, Layout, BarChart, Zap } from 'lucide-react';
import { authService } from '@/services/mock/authService';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => pathname?.includes(path);

    const handleLogout = async () => {
        await authService.logout();
        router.push('/dashboard/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-10">
            <div className="p-6 border-b border-slate-100 flex flex-col gap-2">
                <Link href="/" className="block">
                    <img src="/logo.png" alt="Learn and Travel" className="h-8 w-auto object-contain" />
                </Link>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {pathname.includes('/student') ? 'Student Platform' :
                        pathname.includes('/admin') ? 'Staff Platform' :
                            pathname.includes('/partner') ? 'Partner Platform' :
                                'Platform'}
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</div>

                {/* Student Links */}
                {pathname.includes('/student') && (
                    <>
                        <Link href="/dashboard/student" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student') && !isActive('/student/') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <Home className="w-5 h-5" /> Dashboard
                        </Link>
                        <Link href="/dashboard/student/trips" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student/trips') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <Map className="w-5 h-5" /> My Trips
                        </Link>
                        <Link href="/dashboard/student/documents" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student/documents') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <FileText className="w-5 h-5" /> Documents
                        </Link>
                        <Link href="/dashboard/student/finance" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student/finance') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <CreditCard className="w-5 h-5" /> Finance
                        </Link>
                        <Link href="/dashboard/student/resources" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student/resources') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <BookOpen className="w-5 h-5" /> Resources
                        </Link>
                        <Link href="/dashboard/student/messages" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student/messages') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <MessageSquare className="w-5 h-5" /> Messages
                        </Link>
                        <Link href="/dashboard/student/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/student/profile') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <User className="w-5 h-5" /> My Profile
                        </Link>
                    </>
                )}

                {/* Admin Links */}
                {pathname.includes('/admin') && (
                    <>
                        <Link href="/dashboard/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') && !isActive('/crm') && !isActive('/finance') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <Home className="w-5 h-5" />
                            Overview
                        </Link>
                        <Link href="/dashboard/admin/finance" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/finance') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <CreditCard className="w-5 h-5" />
                            Finance
                        </Link>
                        <Link href="/dashboard/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard/admin/dashboard') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <BarChart className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link href="/dashboard/admin/crm" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/crm') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <Users className="w-5 h-5" />
                            CRM
                        </Link>
                        <Link href="/dashboard/admin/cms" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/cms') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <Layout className="w-5 h-5" />
                            CMS
                        </Link>
                        <Link href="/dashboard/admin/documents" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/documents') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <FileText className="w-5 h-5" />
                            Validations
                        </Link>
                        <Link href="/dashboard/admin/marketing" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/marketing') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <Zap className="w-5 h-5" />
                            Marketing
                        </Link>
                    </>
                )}

                {/* Partner Links */}
                {pathname.includes('/partner') && (
                    <>
                        <Link href="/dashboard/partner" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/partner') ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <Briefcase className="w-5 h-5" />
                            My Offers
                        </Link>
                    </>
                )}

            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
