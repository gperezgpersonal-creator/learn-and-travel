import { supabase } from '@/lib/supabase';
import { MedicalProfile, LogisticsProfile, StudentDocument, MagicLink, DocumentType } from '@/types/student';

export const StudentService = {
    // === Secure Updates via Magic Link ===
    updateStudentViaToken: async (token: string, section: 'basic' | 'medical' | 'logistics', data: any): Promise<void> => {
        const { error } = await supabase.rpc('update_student_via_token', {
            p_token: token,
            p_section: section,
            p_data: data
        });
        if (error) {
            console.error("StudentService update error:", error);
            throw error;
        }
    },

    uploadDocumentViaToken: async (token: string, file: File, type: DocumentType, metadata?: any): Promise<StudentDocument> => {
        // 1. Validate token first (optimization to avoid upload if invalid) - handled by RPC later but good to check? 
        // No, let's just upload. Policy allows public upload.
        // We need a path. We don't have studentId easily unless we fetch it or use the token to get it?
        // We need to name the file properly. 
        // RPC `update_student_via_token` doesn't give us the ID.
        // We need the student ID to structure the folder path `student_id/doc_type...`.
        // Validate token RPC returns void.
        // We can add an RPC `get_student_id_from_token` or just use `validateMagicLink` which returns ID.

        // Use existing validateMagicLink to get ID (it's public/service role safe?)
        // validateMagicLink uses RPC `validate_magic_link` which returns UUID.

        const { studentId } = await StudentService.validateMagicLink(token);

        if (!studentId) {
            throw new Error("Invalid token or student not found");
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${studentId}/${type}_${Date.now()}.${fileExt}`;

        // 2. Upload to Storage (Public Insert Policy)
        const { error: uploadError } = await supabase.storage
            .from('student-secure-docs')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 3. Register Document via Token RPC
        const { data, error } = await supabase.rpc('register_document_via_token', {
            p_token: token,
            p_document_type: type,
            p_file_path: fileName,
            p_metadata: { ...metadata, original_name: file.name }
        });

        if (error) {
            // Cleanup upload if DB fails? (Optional but good practice)
            await supabase.storage.from('student-secure-docs').remove([fileName]);
            throw error;
        }

        return data as StudentDocument;
    },

    // === Profiles ===
    getStudentById: async (studentId: string): Promise<any> => {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .single();
        if (error) throw error;
        return data;
    },

    updateBasicInfo: async (studentId: string, info: { first_name?: string; last_name?: string; phone?: string; birth_date?: string; address?: string; educational_id?: string }): Promise<void> => {
        const { error } = await supabase
            .from('students')
            .update({
                first_name: info.first_name,
                last_name: info.last_name,
                phone: info.phone,
                address: info.address,
                educational_id: info.educational_id,
            })
            .eq('id', studentId);

        if (error) throw error;

        // If birth_date is passed, put it in logistics_profile (merging)
        if (info.birth_date) {
            const { data } = await supabase.from('students').select('logistics_profile').eq('id', studentId).single();
            const current = data?.logistics_profile || {};
            const { error: logError } = await supabase
                .from('students')
                .update({ logistics_profile: { ...current, birth_date: info.birth_date } })
                .eq('id', studentId);
            if (logError) throw logError;
        }
    },

    updateMedicalProfile: async (studentId: string, profile: MedicalProfile): Promise<void> => {
        const { error } = await supabase
            .from('students')
            .update({ medical_profile: profile })
            .eq('id', studentId);

        if (error) throw error;
    },

    updateLogisticsProfile: async (studentId: string, profile: LogisticsProfile): Promise<void> => {
        const { error } = await supabase
            .from('students')
            .update({ logistics_profile: profile })
            .eq('id', studentId);

        if (error) throw error;
    },

    // === Documents ===
    uploadDocument: async (
        studentId: string,
        file: File,
        type: DocumentType,
        metadata: { document_number?: string; expiration_date?: string } = {}
    ): Promise<StudentDocument | null> => {
        // 1. Upload to Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${studentId}/${type}_${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
            .from('student-secure-docs')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Register in Database
        const { data, error: dbError } = await supabase
            .from('student_documents')
            .insert({
                student_id: studentId,
                document_type: type,
                file_path: filePath,
                status: 'pending',
                document_number: metadata.document_number,
                expiration_date: metadata.expiration_date,
                metadata: metadata // Store redundancy in metadata jsonb if needed, or just keep specialized columns
            })
            .select()
            .single();

        if (dbError) throw dbError;
        return data as StudentDocument;
    },

    getDocuments: async (studentId: string): Promise<StudentDocument[]> => {
        const { data, error } = await supabase
            .from('student_documents')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as StudentDocument[];
    },

    getDocumentUrl: async (filePath: string): Promise<string | null> => {
        const { data, error } = await supabase.storage
            .from('student-secure-docs')
            .createSignedUrl(filePath, 60 * 60); // 1 hour

        if (error) {
            console.error('Error creating signed URL', error);
            return null;
        }
        return data.signedUrl;
    },

    deleteDocument: async (documentId: string, filePath: string): Promise<void> => {
        // 1. Remove from Storage
        const { error: storageError } = await supabase.storage
            .from('student-secure-docs')
            .remove([filePath]);

        if (storageError) console.error('Error removing file from storage:', storageError);
        // We continue to delete from DB even if storage fails (orphan cleanup later)

        // 2. Remove from DB
        const { error: dbError } = await supabase
            .from('student_documents')
            .delete()
            .eq('id', documentId);

        if (dbError) throw dbError;
    },

    // === Magic Links ===
    generateMagicLink: async (studentId: string, expiresInDays: number = 7): Promise<string> => {
        console.log('Generating Magic Link for:', studentId);

        // 1. Generate unique token
        let token;
        try {
            token = crypto.randomUUID();
        } catch (e) {
            console.error('crypto.randomUUID failed, falling back to simple random', e);
            token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        // 2. Save to DB
        const { data, error } = await supabase
            .from('magic_links')
            .insert({
                student_id: studentId,
                token: token,
                expires_at: expiresAt.toISOString()
            })
            .select();

        if (error) {
            console.error('Supabase Error in generateMagicLink:', JSON.stringify(error, null, 2));
            throw error;
        }

        console.log('Magic Link generated successfully:', data);
        return token;
    },

    validateMagicLink: async (token: string): Promise<{ isValid: boolean, studentId?: string, studentData?: any }> => {
        const { data, error } = await supabase.rpc('validate_magic_link', { token_input: token });

        // RPC returns a single row if successful, looking like { valid: true, student_id: ..., first_name: ... }
        // The return type of the function is TABLE(...), so rpc returns data as array of rows.
        // Wait, supabase client handles single vs array depending on definition?
        // Usually rpc calls returning TABLE return an array.

        if (error) {
            console.error('Magic Link Validation Error', error);
            return { isValid: false };
        }

        const result = Array.isArray(data) ? data[0] : data;

        if (!result || !result.valid) {
            return { isValid: false };
        }

        return {
            isValid: true,
            studentId: result.student_id,
            studentData: result // Return full object
        };
    },

    updateDocumentMetadataViaToken: async (token: string, type: DocumentType, metadata: any): Promise<void> => {
        const { data, error } = await supabase.rpc('update_document_metadata_via_token', {
            p_token: token,
            p_document_type: type,
            p_metadata: metadata
        });

        if (error) {
            console.error('Error updating metadata:', JSON.stringify(error, null, 2));
            throw error;
        }

        if (data && !data.success) {
            throw new Error(data.error || 'Failed to update metadata');
        }
    },

    // === Enrollments ===
    getStudentEnrollments: async (studentId: string): Promise<any[]> => {
        const { data, error } = await supabase
            .from('student_enrollments')
            .select('*')
            .eq('student_id', studentId);

        if (error) throw error;
        return data || [];
    },

    enrollStudent: async (studentId: string, programId: string): Promise<void> => {
        const { error } = await supabase
            .from('student_enrollments')
            .insert({
                student_id: studentId,
                program_id: programId,
                status: 'enrolled'
            });

        if (error) {
            // Provide friendly error if duplicate
            if (error.code === '23505') { // Unique violation
                throw new Error('Student is already enrolled in this program');
            }
            throw error;
        }
    },

    getProgramEnrollments: async (programId: string): Promise<any[]> => {
        const { data, error } = await supabase
            .from('student_enrollments')
            .select('*, students:student_id(first_name, last_name, email, phone, human_id)')
            .eq('program_id', programId);

        if (error) throw error;
        return data || [];
    },

    unenrollStudent: async (studentId: string, programId: string): Promise<void> => {
        const { error } = await supabase
            .from('student_enrollments')
            .delete()
            .match({ student_id: studentId, program_id: programId });

        if (error) throw error;
    }
};

