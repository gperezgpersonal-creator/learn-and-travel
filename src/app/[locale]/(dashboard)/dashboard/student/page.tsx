'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/mock/studentService';
import { Trip, Document, Transaction, User } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { Clock, AlertTriangle, CheckCircle, FileText, CreditCard, Map, User as UserIcon } from 'lucide-react';
import { Link } from '@/navigation';

export default function StudentDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [trip, setTrip] = useState<Trip | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Dev State
    const [simulatedRole, setSimulatedRole] = useState<'student' | 'parent'>('student');
    const [simulatedProfile, setSimulatedProfile] = useState<'exemplary' | 'problematic'>('exemplary');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            // Simulate switching users based on dev toggle
            const userId = simulatedProfile === 'exemplary' ? 'student-exemplary' : 'student-problematic';

            // In a real app, we would get the current user from auth context
            // Here we mock fetching the specific profile
            const tripData = await studentService.getTrip('trip-london');
            const docsData = await studentService.getDocuments(userId);
            const txData = await studentService.getTransactions(userId);

            // Mock User Object
            const userData: User = {
                id: userId,
                internalId: simulatedProfile === 'exemplary' ? 'S-2025-005' : 'S-2025-004',
                name: simulatedProfile === 'exemplary' ? 'Valentina Perfecta' : 'Kevin Desastre',
                email: 'student@demo.com',
                role: 'student',
                avatar: simulatedProfile === 'exemplary' ? 'https://i.pravatar.cc/150?u=valentina' : 'https://i.pravatar.cc/150?u=kevin'
            };

            setUser(userData);
            setTrip(tripData);
            setDocuments(docsData);
            setTransactions(txData);
            setLoading(false);
        };
        loadData();
    }, [simulatedProfile]);

    // Traffic Light Logic
    const getStatus = () => {
        const hasRejectedDocs = documents.some(d => d.status === 'rejected');
        const hasOverduePayments = transactions.some(t => t.status === 'overdue');
        const hasPendingPayments = transactions.some(t => t.status === 'pending');

        if (hasRejectedDocs || hasOverduePayments) {
            return { color: 'red', message: 'Action Required', description: hasRejectedDocs ? 'One or more documents were rejected.' : 'You have overdue payments.' };
        }
        if (hasPendingPayments) {
            return { color: 'amber', message: 'Pending Items', description: 'You have upcoming payments.' };
        }
        return { color: 'green', message: 'All Set!', description: 'You are ready for your trip.' };
    };

    const status = getStatus();

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-8 relative">
            {/* Dev Controls */}
            <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl text-xs space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                <div className="font-bold text-slate-400 uppercase mb-1">Dev Controls</div>
                <div className="flex gap-2 items-center">
                    <span>Profile:</span>
                    <select
                        value={simulatedProfile}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e) => setSimulatedProfile(e.target.value as any)}
                        className="bg-slate-800 rounded px-2 py-1"
                    >
                        <option value="exemplary">Exemplary Student</option>
                        <option value="problematic">Problematic Student</option>
                    </select>
                </div>
                <div className="flex gap-2 items-center">
                    <span>View As:</span>
                    <div className="flex bg-slate-800 rounded p-1">
                        <button
                            onClick={() => setSimulatedRole('student')}
                            className={`px-2 py-1 rounded ${simulatedRole === 'student' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setSimulatedRole('parent')}
                            className={`px-2 py-1 rounded ${simulatedRole === 'parent' ? 'bg-purple-600' : 'hover:bg-slate-700'}`}
                        >
                            Parent
                        </button>
                    </div>
                </div>
            </div>

            <FadeIn>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-1">
                            Hello, {simulatedRole === 'parent' ? 'Parent of ' : ''}{user?.name.split(' ')[0]}! 👋
                        </h1>
                        {user?.internalId && (
                            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md mb-2 border border-blue-100">
                                ID: {user.internalId}
                            </div>
                        )}
                        <p className="text-slate-500">
                            {status.message === 'All Set!' ? "Everything looks great. You're ready to fly!" : "Let's get you ready for your trip."}
                        </p>
                    </div>
                    {/* Countdown Widget */}
                    <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-slate-400 uppercase font-bold">Next Trip</div>
                            <div className="font-serif font-bold text-primary">London 2026</div>
                        </div>
                        <div className="h-10 w-px bg-slate-100"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-800">245</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Days</div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Traffic Light Status */}
            <FadeIn delay={0.1}>
                <div className={`p-6 rounded-xl border flex items-start gap-4 ${status.color === 'red' ? 'bg-red-50 border-red-100' :
                    status.color === 'amber' ? 'bg-orange-50 border-orange-100' :
                        'bg-green-50 border-green-100'
                    }`}>
                    <div className={`p-3 rounded-full ${status.color === 'red' ? 'bg-red-100 text-red-600' :
                        status.color === 'amber' ? 'bg-orange-100 text-orange-600' :
                            'bg-green-100 text-green-600'
                        }`}>
                        {status.color === 'red' ? <AlertTriangle className="w-6 h-6" /> :
                            status.color === 'amber' ? <Clock className="w-6 h-6" /> :
                                <CheckCircle className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-bold text-lg ${status.color === 'red' ? 'text-red-800' :
                            status.color === 'amber' ? 'text-orange-800' :
                                'text-green-800'
                            }`}>
                            {status.message}
                        </h3>
                        <p className={`text-sm ${status.color === 'red' ? 'text-red-600' :
                            status.color === 'amber' ? 'text-orange-600' :
                                'text-green-600'
                            }`}>
                            {status.description}
                        </p>
                    </div>
                    {status.color === 'red' && (
                        <Link href="/dashboard/student/documents" className="btn bg-red-600 text-white hover:bg-red-700 border-none text-sm py-2">
                            Fix Issues
                        </Link>
                    )}
                </div>
            </FadeIn>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FadeIn delay={0.2}>
                    <Link href="/dashboard/student/trips" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                        <div className="bg-blue-50 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                            <Map className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-700">View Itinerary</span>
                    </Link>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <Link href="/dashboard/student/documents" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                        <div className="bg-orange-50 p-4 rounded-full text-orange-600 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-700">Upload Docs</span>
                    </Link>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <Link href="/dashboard/student/finance" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                        <div className="bg-green-50 p-4 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-700">Make Payment</span>
                    </Link>
                </FadeIn>
                <FadeIn delay={0.5}>
                    <Link href="/dashboard/student/profile" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                        <div className="bg-purple-50 p-4 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-700">Edit Profile</span>
                    </Link>
                </FadeIn>
            </div>
        </div>
    );
}
