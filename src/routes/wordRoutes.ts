import { Router } from 'express';
import { getSampleWords, getAllWords } from '../controllers/wordController';

const router = Router();

router.get('/', getSampleWords);
router.get('/all', getAllWords); 

export default router;
