'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';
import { Loader2, Lock } from 'lucide-react';

interface Order {
    id: string;
    date: string;
    amount: number;
    status: string;
    customerEmail: string;
    customerName: string;
    programName: string;
    metadata: {
        studentId?: string;
        school?: string;
        phone?: string;
        address?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

export default function AdminOrdersPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin2025') {
            setIsAuthenticated(true);
            fetchOrders();
        } else {
            setError('Contraseña incorrecta');
        }
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/orders');
            const data = await response.json();
            if (data.error) {
                console.error(data.error);
                return;
            }
            setOrders(data.orders || []);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Panel de Administración</h1>
                        <p className="text-slate-500">Ingresa la contraseña para ver los pedidos.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Contraseña"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button className="btn btn-primary w-full py-3">Entrar</button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="container-custom max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Pedidos Recientes (Stripe)</h1>
                    <button onClick={fetchOrders} className="btn btn-outline text-sm flex gap-2 items-center">
                        {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                        Actualizar
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Alumno</th>
                                    <th className="px-6 py-4">ID / Matrícula</th>
                                    <th className="px-6 py-4">Programa</th>
                                    <th className="px-6 py-4">Monto</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Contacto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{order.date}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {order.customerName}
                                            {order.metadata.school && (
                                                <div className="text-xs text-slate-400 mt-1">{order.metadata.school}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">
                                                {order.metadata.studentId || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 max-w-xs truncate" title={order.programName}>
                                            {order.programName}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            {formatCurrency(order.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {order.status === 'paid' ? 'Pagado' : order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div>{order.customerEmail}</div>
                                            <div className="text-xs mt-1">{order.metadata.phone}</div>
                                        </td>
                                    </tr>
                                ))}

                                {orders.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-slate-400">
                                            No se encontraron pedidos recientes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
