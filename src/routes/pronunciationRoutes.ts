import { Router } from 'express';
import { submitPronunciationAttempt } from '../controllers/pronunciationController';

const router = Router();

router.post('/:id', submitPronunciationAttempt);

export default router;
