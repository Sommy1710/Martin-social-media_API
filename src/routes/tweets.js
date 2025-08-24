import {Router} from 'express';
import authMiddleware from '../app/middleware/auth.middleware.js';
import { createNewTweet, deleteSingleTweet, fetchAllTweets, fetchTweet, updateSingleTweet, toggleLike } from '../app/controllers/tweet.controller.js';
const router = Router();

router.get('/', authMiddleware, fetchAllTweets);
router.post('/', authMiddleware,  createNewTweet);
router.get('/:id', authMiddleware, fetchTweet);
router.put('/:id', authMiddleware, updateSingleTweet);
router.delete('/:id', authMiddleware, deleteSingleTweet);
router.post('/:tweetId/like', authMiddleware, toggleLike);

export const tweetRouter = router;