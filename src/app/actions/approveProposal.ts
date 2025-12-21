'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function approveProposal(proposalId: string, data: { name: string; email: string }) {
    if (!data.name || !data.email) {
        return { success: false, error: 'Nombre y correo son requeridos' };
    }

    try {
        const { error } = await supabase
            .from('proposals')
            .update({
                status: 'Approved',
                approver_name: data.name,
                approver_email: data.email,
                approved_at: new Date().toISOString(),
                terms_accepted: true
            })
            .eq('id', proposalId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error approving proposal:', error);
        return { success: false, error: 'Error al guardar la aprobación' };
    }
}
