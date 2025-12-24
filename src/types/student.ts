export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface MedicalProfile {
    blood_type?: BloodType;
    allergies: {
        food: string[]; // e.g., ["Nueces", "Mariscos"]
        medications: string[]; // e.g., ["Penicilina"]
        environmental: string[]; // e.g., ["Abejas"]
    };
    conditions: string; // Textarea content
    medications: string; // Textarea content
    insurance: {
        carrier: string;
        policy_number: string;
        emergency_phone: string;
    };
    emergency_contact?: {
        name: string;
        phone: string;
        email: string;
        relationship: string;
    };
}

export type TshirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type DietaryRestriction = 'Vegetariano' | 'Vegano' | 'Kosher' | 'Halal' | 'Sin Cerdo' | 'Sin Res' | 'Ninguna';

export interface LogisticsProfile {
    tshirt_size?: TshirtSize;
    tshirt_style?: 'Mens' | 'Womens';
    dietary_restrictions: DietaryRestriction[];
    special_needs: string; // Textarea
}

export type DocumentType =
    | 'passport'
    | 'visa_usa'
    | 'birth_certificate'
    | 'medical_proof'
    | 'service_contract'
    | 'code_of_conduct'
    | 'other';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface StudentDocument {
    id: string;
    student_id: string;
    document_type: DocumentType;
    file_path: string;
    document_number?: string;
    expiration_date?: string; // ISO Date string
    status: DocumentStatus;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface MagicLink {
    id: string;
    student_id: string;
    token: string;
    expires_at: string;
    used_at?: string | null;
    created_at: string;
}
