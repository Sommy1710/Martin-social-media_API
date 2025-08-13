import {Router} from 'express';
import authMiddleware from '../app/middleware/auth.middleware.js';
import { addCommentToTweet, deleteComment, getCommentsByTweet,likeComment, replyToComment } from './../app/controllers/comment.controller.js';
const router = Router();
router.post('/:tweetId', authMiddleware, addCommentToTweet);
router.get('/:tweetId', authMiddleware, getCommentsByTweet);
router.delete('/:tweetId/:commentId', authMiddleware, deleteComment);
router.post('/:commentId/like', authMiddleware, likeComment);
router.post('/:tweetId/:commentId/reply', authMiddleware, replyToComment)
export const commentRouter = router;
