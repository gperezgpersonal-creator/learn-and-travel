
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin Client to bypass RLS for checking coupons securely
// We need Admin/Service role if RLS hides non-active coupons, but our policy allows public to view active ones.
// However, creating a server-side client is safer.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
// Fallback to Anon if Service Role is missing, assuming RLS allows 'select' for public on active coupons.

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { code, programId } = await request.json();

        if (!code) {
            return NextResponse.json({ valid: false, message: 'Código requerido' }, { status: 400 });
        }

        const cleanCode = code.toUpperCase().trim();

        // 1. Fetch Coupon
        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', cleanCode)
            .single();

        if (error || !coupon) {
            return NextResponse.json({ valid: false, message: 'Cupón no válido' }, { status: 404 });
        }

        // 2. Checks
        // Active
        if (!coupon.active) {
            return NextResponse.json({ valid: false, message: 'Cupón inactivo' }, { status: 400 });
        }

        // Expiration
        if (coupon.expiration_date && new Date(coupon.expiration_date) < new Date()) {
            return NextResponse.json({ valid: false, message: 'Cupón expirado' }, { status: 400 });
        }

        // Usage Limit
        if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
            return NextResponse.json({ valid: false, message: 'Cupón agotado' }, { status: 400 });
        }

        // Program Specificity
        if (coupon.program_id && programId) {
            // If the coupon is linked to a program, it MUST match the requested program
            // We compare looser to handle cases like '84-ORL2026' vs 'orlando-business-2026' if needed,
            // but for now strict check on ID is best.
            if (coupon.program_id !== programId) {
                return NextResponse.json({ valid: false, message: 'Este cupón no aplica para este programa' }, { status: 400 });
            }
        }

        // 3. Return Success
        return NextResponse.json({
            valid: true,
            discountType: coupon.discount_type, // 'percentage' | 'fixed'
            discountValue: coupon.discount_value,
            code: cleanCode
        });

    } catch (err) {
        console.error('Coupon Validation Error:', err);
        return NextResponse.json({ valid: false, message: 'Error validando cupón' }, { status: 500 });
    }
}
