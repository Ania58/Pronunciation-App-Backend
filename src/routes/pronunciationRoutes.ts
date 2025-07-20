import { Router } from 'express';
import { submitPronunciationAttempt, getPronunciationAttempts, updatePronunciationFeedback, deletePronunciationAttempt, getUserPronunciationAttempts,  transcribePronunciation } from '../controllers/pronunciationController';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.get('/user/attempts', verifyToken, getUserPronunciationAttempts);
router.post('/:id', verifyToken, submitPronunciationAttempt);
router.get('/:id/attempts', verifyToken, getPronunciationAttempts);
router.patch('/:id/feedback', verifyToken, updatePronunciationFeedback);
router.delete('/:id', verifyToken, deletePronunciationAttempt);
router.post('/:id/transcribe', verifyToken, transcribePronunciation);



export default router;
