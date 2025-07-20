import { Router } from 'express';
import { getSampleWords, getAllWords, getWordByText, searchWords, getRandomWord, getWordById  } from '../controllers/wordController';
import { updateWordStatus, getAllStatuses, deleteWordStatus } from '../controllers/wordStatusController'; 
import { verifyToken } from '../middleware/verifyToken';


const router = Router();

router.get('/', getSampleWords);
router.get('/all', getAllWords); 
router.get('/search', searchWords);
router.get('/random', getRandomWord);
router.get('/statuses',  verifyToken, getAllStatuses);
router.post('/:id/status',  verifyToken, updateWordStatus);
router.delete('/:id/status',  verifyToken, deleteWordStatus);
router.get('/id/:id', getWordById);
router.get('/:word', getWordByText);



export default router;
