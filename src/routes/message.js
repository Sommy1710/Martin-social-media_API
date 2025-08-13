import {Router} from 'express';
import authMiddleware from '../app/middleware/auth.middleware.js';
import { getMessages, sendMessage } from '../app/controllers/message.controller.js';
const router = Router();


router.get('/:userId', authMiddleware, getMessages);
router.post('/messages', authMiddleware, sendMessage)
export const messageRouter = router;
