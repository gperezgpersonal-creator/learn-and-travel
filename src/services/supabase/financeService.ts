import { supabase } from '@/lib/supabase';

import { MedicalProfile, LogisticsProfile } from '@/types/student';

export interface Student {
    id: string;
    human_id: string;
    user_id?: string | null;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    educational_id?: string;
    address?: string; // New field
    created_at: string;

    // Profiles (JSONB)
    medical_profile?: MedicalProfile;
    logistics_profile?: LogisticsProfile;

    // Joined balance fields from view
    total_charges?: number;
    total_payments?: number;
    balance?: number;
}

export interface Payment {
    id: string;
    stripe_charge_id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'reconciled';
    raw_data: any;
    created_at: string;
}

export interface LedgerEntry {
    id: string;
    student_id: string;
    type: 'charge' | 'payment';
    amount: number;
    concept: string;
    metadata: any;
    payment_method?: string;
    occurred_at?: string;
    created_at: string;
}

export const FinanceService = {
    // === Payments (Staging) ===
    getPendingPayments: async (): Promise<Payment[]> => {
        const { data, error } = await supabase
            .from('stripe_staging_area')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Payment[];
    },

    // === Students ===
    getAllStudents: async (): Promise<Student[]> => {
        // Fetch from the view to get balances efficiently
        const { data, error } = await supabase
            .from('student_balances')
            .select('*')
            .order('human_id', { ascending: true });

        if (error) {
            console.error('Error fetching students:', error);
            return [];
        }

        return (data || []).map((row: any) => ({
            ...row,
            id: row.student_id // Map view column 'student_id' to interface 'id'
        })) as Student[];
    },

    searchStudents: async (query: string): Promise<Student[]> => {
        if (!query) return FinanceService.getAllStudents();

        const { data, error } = await supabase
            .from('student_balances')
            .select('*')
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,human_id.ilike.%${query}%`)
            .order('first_name', { ascending: true });

        if (error) throw error;

        return (data || []).map((row: any) => ({
            ...row,
            id: row.student_id
        })) as Student[];
    },

    getStudentById: async (id: string): Promise<Student | null> => {
        const { data, error } = await supabase
            .from('student_balances') // Fetch from view to get balance
            .select('*')
            .eq('student_id', id)
            .single();

        if (error) return null;

        const row = data as any;
        return {
            ...row,
            id: row.student_id
        } as Student;
    },

    createStudent: async (student: Partial<Student>): Promise<Student | null> => {
        const { data, error } = await supabase
            .from('students')
            .insert({
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                phone: student.phone,
                educational_id: student.educational_id
            })
            .select()
            .single();

        if (error) throw error;
        return data as Student;
    },

    // === Ledger ===
    getStudentLedger: async (studentId: string): Promise<LedgerEntry[]> => {
        const { data, error } = await supabase
            .from('finance_ledger')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as LedgerEntry[];
    },

    addCharge: async (studentId: string, amount: number, concept: string, metadata: any = {}, occurredAt?: string): Promise<LedgerEntry | null> => {
        const { data, error } = await supabase
            .from('finance_ledger')
            .insert({
                student_id: studentId,
                type: 'charge',
                amount: amount,
                concept: concept,
                metadata: metadata,
                occurred_at: occurredAt || new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data as LedgerEntry;
    },

    addPayment: async (studentId: string, amount: number, concept: string, metadata: any = {}, method: string = 'stripe', occurredAt?: string): Promise<LedgerEntry | null> => {
        const { data, error } = await supabase
            .from('finance_ledger')
            .insert({
                student_id: studentId,
                type: 'payment',
                amount: amount,
                concept: concept,
                metadata: metadata,
                payment_method: method,
                occurred_at: occurredAt || new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data as LedgerEntry;
    },

    // === Reconciliation ===
    reconcilePayment: async (paymentId: string, studentId: string): Promise<void> => {
        const { error } = await supabase
            .rpc('reconcile_payment', {
                payment_id: paymentId,
                target_student_id: studentId
            });

        if (error) throw error;
    },

    unreconcilePayment: async (ledgerId: string): Promise<void> => {
        const { error } = await supabase
            .rpc('unreconcile_payment', {
                ledger_entry_id: ledgerId
            });

        if (error) throw error;
    }
};
