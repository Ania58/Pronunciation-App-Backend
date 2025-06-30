import { Router } from 'express';
import { submitPronunciationAttempt, getPronunciationAttempts, updatePronunciationFeedback, deletePronunciationAttempt } from '../controllers/pronunciationController';

const router = Router();

router.post('/:id', submitPronunciationAttempt);
router.get('/:id/attempts', getPronunciationAttempts);
router.patch('/:id/feedback', updatePronunciationFeedback);
router.delete('/:id', deletePronunciationAttempt);


export default router;
