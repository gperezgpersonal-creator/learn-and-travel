export type ProposalStatus = 'Draft' | 'Sent' | 'Approved' | 'Changes Requested';

export interface Proposal {
    id: string;
    created_at: string;
    title: string;
    client_name: string;
    status: ProposalStatus;
    latest_version_number: number;
    is_hidden: boolean;
}

export interface ProposalVersion {
    id: string;
    proposal_id: string;
    version_number: number;
    created_at: string;
    content: ProposalContent;
    is_published: boolean;
}

// The detailed content structure stored in JSONB
export interface ProposalContent {
    general: {
        logo_url?: string;
        cover_url?: string;
        program_title: string;
        city: string;
        dates: string;
        professor_name: string;
    };
    intro: {
        title: string;
        text: string;
        objective: string;
        visible: boolean;
    };
    details: {
        title: string;
        content_text: string;
        learning_outcomes: string;
        partners: { name: string; image_url?: string }[];
        partners_banner_url?: string;
        itinerary: { day: string; activity: string }[];
        visible: boolean;
    };
    logistics: {
        title: string;
        inclusions: string;
        flights: string;
        hotel: string;
        transport: string;
        visible: boolean;
    };
    financials: {
        title: string;
        investment_base: string;
        notes: string;
        visible: boolean;
    };
    legal: {
        title: string;
        disclaimer: string;
    };
}

export const cleanEmptyProposalContent: ProposalContent = {
    general: { program_title: '', city: '', dates: '', professor_name: '' },
    intro: { title: 'Introducción', text: '', objective: '', visible: true },
    details: { title: 'Detalles del Programa', content_text: '', learning_outcomes: '', partners: [], itinerary: [], visible: true },
    logistics: { title: 'Logística', inclusions: '', flights: '', hotel: '', transport: '', visible: true },
    financials: { title: 'Inversión', investment_base: '', notes: '', visible: true },
    legal: { title: 'Notas Legales', disclaimer: 'Partners sujetos a cambios por disponibilidad de agendas.' }
};
