import { Router } from 'express';
import { DataController } from '../controllers/dataController';
import supabase from '../config/supabase';

const router = Router();
const dataController = new DataController(supabase);

router.post('/books', dataController.insertData.bind(dataController));

export const setApiRoutes = (app: any) => {
    app.use('/api', router);
};