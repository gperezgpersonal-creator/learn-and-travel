'use client';

import CouponForm from '@/components/admin/coupons/CouponForm';
import { useRouter } from '@/navigation';

export default function NewCouponPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Crear Nuevo Cupón</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <CouponForm
                    onSuccess={() => router.push('/dashboard/admin/coupons')}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
}
