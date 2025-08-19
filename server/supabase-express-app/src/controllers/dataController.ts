import { SupabaseClient } from '@supabase/supabase-js';
import { Book } from '../types';

export class DataController {
    constructor(private supabaseClient: SupabaseClient) {}

    async insertData(req: any, res: any) {
        try {
            const bookData: Book = req.body;
            const { data, error } = await this.supabaseClient
                .from('livros')
                .insert(bookData);

            if (error) throw error;
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}