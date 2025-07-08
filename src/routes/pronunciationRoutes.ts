import { Router } from 'express';
import { submitPronunciationAttempt, getPronunciationAttempts, updatePronunciationFeedback, deletePronunciationAttempt, getUserPronunciationAttempts,  transcribePronunciation } from '../controllers/pronunciationController';

const router = Router();

router.get('/user/attempts', getUserPronunciationAttempts);
router.post('/:id', submitPronunciationAttempt);
router.get('/:id/attempts', getPronunciationAttempts);
router.patch('/:id/feedback', updatePronunciationFeedback);
router.delete('/:id', deletePronunciationAttempt);
router.post('/:id/transcribe', transcribePronunciation);



export default router;
