export type ProspectStatus = 'Nuevo' | 'Contactado' | 'Mostro interés' | 'Cliente';

export interface Prospect {
    id: string;
    form_id: string;
    folio?: string;
    name: string;
    email: string;
    phone: string;
    status?: ProspectStatus;
    is_hidden?: boolean;
    created_at: string;
}
