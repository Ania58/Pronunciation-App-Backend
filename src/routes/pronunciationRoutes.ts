import { Router } from 'express';
import { submitPronunciationAttempt, getPronunciationAttempts } from '../controllers/pronunciationController';

const router = Router();

router.post('/:id', submitPronunciationAttempt);
router.get('/:id/attempts', getPronunciationAttempts);

export default router;
