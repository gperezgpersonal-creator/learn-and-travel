'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CouponForm from '@/components/admin/coupons/CouponForm';
import { useRouter } from '@/navigation';
import { Loader2 } from 'lucide-react';
import { use } from 'react';

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
    // Correctly unwrap params using React.use() or await in async component
    // Since this is a client component, we use `use` or just treat it as a promise if Next 15
    // But for safety in standar Next 14/15 client components with async params:
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const [coupon, setCoupon] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCoupon = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error loading coupon:', error);
                alert('Cupón no encontrado');
                router.push('/dashboard/admin/coupons');
                return;
            }

            setCoupon(data);
            setIsLoading(false);
        };

        if (id) fetchCoupon();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Editar Cupón</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <CouponForm
                    initialData={coupon}
                    onSuccess={() => router.push('/dashboard/admin/coupons')}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
}
