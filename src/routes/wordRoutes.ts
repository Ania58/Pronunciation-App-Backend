import { Router } from 'express';
import { getSampleWords, getAllWords, getWordByText, searchWords, getRandomWord } from '../controllers/wordController';

const router = Router();

router.get('/', getSampleWords);
router.get('/all', getAllWords); 
router.get('/search', searchWords);
router.get('/random', getRandomWord);
router.get('/:word', getWordByText);

export default router;
