import {Router} from 'express';
import upload from '../app/controllers/upload.js';
import uploadImage from '../app/controllers/uploadController.js';
import authMiddleware from '../app/middleware/auth.middleware.js';

const router = Router();

router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
export const uploadRouter = router;

