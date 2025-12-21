'use client';

import FadeIn from '@/components/ui/FadeIn';
import {
    CreditCard, Layout, Calculator, Link as LinkIcon, BookOpen, Clock, ArrowRight
} from 'lucide-react';
import { Link } from '@/navigation';

export default function AdminDashboard() {
    const quickAccess = [
        {
            title: "Genera una nueva cotización",
            subtitle: "Nuevo cotizador",
            link: "/dashboard/admin/finance?tab=quoter",
            icon: Calculator,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Historial de cotizaciones",
            subtitle: "Historial de cotizaciones",
            link: "/dashboard/admin/finance?tab=historial",
            icon: Clock,
            color: "bg-purple-50 text-purple-600"
        },
        {
            title: "Consulta los pagos realizados",
            subtitle: "Admin Orders",
            link: "/dashboard/admin/finance?tab=orders",
            icon: CreditCard,
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Edita programas (solo precios)",
            subtitle: "CMS",
            link: "/dashboard/admin/cms",
            icon: Layout,
            color: "bg-orange-50 text-orange-600"
        },
        {
            title: "Consulta programas y formularios",
            subtitle: "Programas y Formularios",
            link: "/dashboard/admin/forms-directory",
            icon: LinkIcon,
            color: "bg-indigo-50 text-indigo-600"
        },
        {
            title: "Accede a los programas del TEC de Monterrey",
            subtitle: "Programas Tec de Monterrey",
            link: "/programs/tec-de-monterrey",
            icon: BookOpen,
            color: "bg-red-50 text-red-600"
        }
    ];

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-primary mb-2">Control Tower</h1>
                    <p className="text-slate-500">Accesos rápidos para la gestión operativa.</p>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickAccess.map((item, index) => (
                    <FadeIn key={index} delay={index * 0.1}>
                        <Link href={item.link} className="block group">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <item.icon className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.color}`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        {item.subtitle}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 pr-8 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        Acceder <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </FadeIn>
                ))}
            </div>
        </div>
    );
}
