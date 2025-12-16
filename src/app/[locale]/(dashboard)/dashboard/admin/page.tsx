'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/mock/adminService';
import { Trip, ActivityLog } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import {
    TrendingUp, Users, DollarSign, FileText,
    MessageSquare, CreditCard, Calendar, ArrowRight,
    Activity
} from 'lucide-react';
import { Link } from '@/navigation';

export default function AdminDashboard() {
    const [kpis, setKpis] = useState<any>(null);
    const [pending, setPending] = useState<any>(null);
    const [departures, setDepartures] = useState<Trip[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const kpiData = await adminService.getDashboardKPIs();
            const pendingData = await adminService.getPendingItems();
            const tripsData = await adminService.getUpcomingDepartures();
            const logsData = await adminService.getRecentLogs();

            setKpis(kpiData);
            setPending(pendingData);
            setDepartures(tripsData);
            setLogs(logsData);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8">Loading control tower...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Control Tower</h1>
                        <p className="text-slate-500">Operational overview for {new Date().toLocaleDateString()}.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-slate-500 uppercase">Today's Revenue</div>
                        <div className="text-2xl font-bold text-green-600">+${kpis.paymentsToday.toLocaleString()}</div>
                    </div>
                </div>
            </FadeIn>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <FadeIn delay={0.1}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-4 rounded-full text-blue-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 font-bold uppercase">Enrollment</div>
                            <div className="text-3xl font-bold text-slate-800">
                                {kpis.enrollment} <span className="text-sm text-slate-400 font-normal">/ {kpis.enrollmentGoal}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(kpis.enrollment / kpis.enrollmentGoal) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-green-50 p-4 rounded-full text-green-600">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 font-bold uppercase">Total Revenue</div>
                            <div className="text-3xl font-bold text-slate-800">${kpis.sales.toLocaleString()}</div>
                            <div className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> +12% vs last month
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-purple-50 p-4 rounded-full text-purple-600">
                            <Activity className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 font-bold uppercase">Active Leads</div>
                            <div className="text-3xl font-bold text-slate-800">24</div>
                            <div className="text-xs text-slate-400 mt-1">8 hot leads require attention</div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Pending Inbox */}
                <div className="md:col-span-2 space-y-6">
                    <FadeIn delay={0.4}>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Pending Actions</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <Link href="/dashboard/admin/documents" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-orange-50 p-3 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{pending.documents}</span>
                                </div>
                                <h3 className="font-bold text-slate-700">Documents</h3>
                                <p className="text-sm text-slate-500">Awaiting validation</p>
                            </Link>
                            <Link href="/dashboard/admin/finance" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{pending.payments}</span>
                                </div>
                                <h3 className="font-bold text-slate-700">Payments</h3>
                                <p className="text-sm text-slate-500">Manual reconciliation</p>
                            </Link>
                            <Link href="/dashboard/admin/crm" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-purple-50 p-3 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">{pending.messages}</span>
                                </div>
                                <h3 className="font-bold text-slate-700">Messages</h3>
                                <p className="text-sm text-slate-500">Unread inquiries</p>
                            </Link>
                        </div>
                    </FadeIn>

                    {/* Activity Log */}
                    <FadeIn delay={0.5}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="bg-slate-50 p-4 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
                                <span>Recent Activity</span>
                                <button className="text-xs text-primary font-bold hover:underline">View All</button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <div key={log.id} className="p-4 flex items-center gap-4 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                        <div className="flex-1">
                                            <span className="font-bold text-slate-700">{log.userId}</span>
                                            <span className="text-slate-500"> {log.action} </span>
                                            <span className="font-medium text-slate-800">{log.details}</span>
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Calendar / Departures */}
                <div className="md:col-span-1">
                    <FadeIn delay={0.6}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-full">
                            <div className="bg-slate-50 p-4 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
                                <Calendar className="w-5 h-5" /> Upcoming Departures
                            </div>
                            <div className="p-4 space-y-4">
                                {departures.map((trip) => (
                                    <div key={trip.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-primary/10 text-primary font-bold px-2 py-1 rounded text-xs uppercase">
                                                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">In 245 Days</div>
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-1">{trip.destination}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-1">{trip.title}</p>
                                        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-primary">
                                            View Manifest <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
