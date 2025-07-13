import express from 'express';
import { sendContactMessage } from '../controllers/contactController';

const router = express.Router();

router.post('/contact', sendContactMessage);

export default router;
