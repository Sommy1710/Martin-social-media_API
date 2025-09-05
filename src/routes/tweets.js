import {Router} from 'express';
import authMiddleware from '../app/middleware/auth.middleware.js';
import { createNewTweet, deleteSingleTweet, fetchAllTweets, fetchTweet,  toggleLike, searchTweets } from '../app/controllers/tweet.controller.js';
import { uploadMultiplePhotos } from '../app/controllers/upload.js';
const router = Router();

router.get('/', authMiddleware, fetchAllTweets);
router.post('/', authMiddleware, uploadMultiplePhotos,  createNewTweet);
router.get('/search', authMiddleware, searchTweets)
router.get('/:id', authMiddleware, fetchTweet);
router.delete('/:id', authMiddleware, deleteSingleTweet);
router.post('/:tweetId/like', authMiddleware, toggleLike);

export const tweetRouter = router;