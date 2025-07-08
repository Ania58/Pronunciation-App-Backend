import { Router } from 'express';
import { getSampleWords, getAllWords, getWordByText, searchWords, getRandomWord, getWordById  } from '../controllers/wordController';
import { updateWordStatus, getAllStatuses } from '../controllers/wordStatusController'; 


const router = Router();

router.get('/', getSampleWords);
router.get('/all', getAllWords); 
router.get('/search', searchWords);
router.get('/random', getRandomWord);
router.get('/statuses', getAllStatuses);
router.post('/:id/status', updateWordStatus);
router.get('/id/:id', getWordById);
router.get('/:word', getWordByText);



export default router;
