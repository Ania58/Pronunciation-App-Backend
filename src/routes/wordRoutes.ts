import { Router } from 'express';
import { getSampleWords } from '../controllers/wordController';

const router = Router();

router.get('/', getSampleWords);

export default router;
