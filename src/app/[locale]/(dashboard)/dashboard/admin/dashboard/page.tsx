"use client";

import React from 'react';
import { MOCK_CONTACTS } from '@/services/mock/mockData';
import { Users, AlertTriangle, UserPlus } from 'lucide-react';

export default function DashboardPage() {
    // KPI Calculations
    const totalEnrolled = MOCK_CONTACTS.filter(c => c.status === 'enrolled').length;
    const criticalAlerts = MOCK_CONTACTS.filter(c => c.healthStatus === 'red').length;

    // Recent Leads (Assuming array order represents recency, taking last 5 'lead' status contacts)
    const recentLeads = MOCK_CONTACTS
        .filter(c => c.status === 'lead')
        .slice(-5)
        .reverse();

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Administrativo</h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* KPI 1: Total Alumnos Inscritos */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Alumnos Inscritos</p>
                        <p className="text-3xl font-bold text-gray-900">{totalEnrolled}</p>
                    </div>
                </div>

                {/* KPI 2: Alertas Críticas */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="p-4 bg-red-100 rounded-full text-red-600">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Alertas Críticas</p>
                        <p className="text-3xl font-bold text-gray-900">{criticalAlerts}</p>
                    </div>
                </div>
            </div>

            {/* List: Últimos 5 Leads */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-gray-500" /> Últimos 5 Leads
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Organización</th>
                                <th className="px-6 py-4">Interés</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentLeads.length > 0 ? (
                                recentLeads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {lead.internalId && <div className="text-xs font-bold text-primary font-mono mb-0.5">{lead.internalId}</div>}
                                            <div>{lead.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.organization}</td>
                                        <td className="px-6 py-4 text-blue-600 text-sm">{lead.programInterest}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                                        No hay leads recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
