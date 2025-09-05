import {Router} from 'express';
import authMiddleware from '../app/middleware/auth.middleware.js';
import { getMessages, sendMessage } from '../app/controllers/message.controller.js';
import { uploadSinglePhoto, uploadMultiplePhotos } from '../app/controllers/upload.js';
const router = Router();


router.get('/:userId', authMiddleware, getMessages);
router.post('/', authMiddleware, uploadMultiplePhotos, sendMessage);
export const messageRouter = router;
