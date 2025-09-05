import { commentRequest } from './../requests/create-comment.request.js';
import {Comment} from '../schema/comment.schema.js';
import { Validator } from "../../lib/validator.js";
import { Tweet } from '../schema/tweet.schema.js';
import { UnauthenticatedError } from '../../lib/error-definitions.js';

export const addCommentToTweet = async (req, res, next) => {
    try {
        const validator = new Validator();
        const { error, value } = validator.validate(commentRequest, req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }
        const {tweetId} = req.params;
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({error: 'tweet not found'});
        }
        const comment = await Comment.create({
            tweetId,
            author: value.author,
            content: value.content
        });
        tweet.comments.push(comment._id);
        await tweet.save();

        res.status(201).json({
            message: 'comment added',
            data: comment
        });
    } catch (err) {
        next(err);
    }
}

export const getCommentsByTweet = async (req, res) => {
    const {tweetId} = req.params;
    try {
        const comments = await Comment.find({tweetId}).sort({createdAt: -1});

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({error: 'failed to retrieve comments '});
    }
};

export const deleteComment = async(req, res, next) => {
    try {
        const {tweetId, commentId} = req.params;
        // check if tweet exists
        const tweet = await Tweet.findById(tweetId)
        if (!tweet) {
            return res.status(404).json({error: 'tweet not found'});
        }
        //check if comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({error: 'Comment not found'});
        }
        //check if the authenticated user is the comment owner
        if (comment.author.toString() !== req.user.id) {
            throw new UnauthenticatedError('you are not authorized to delete this comment')
        }
        //remove comment reference from tweet
        tweet.comments = tweet.comments.filter(
            (id) => id.toString() !== commentId
        );
        await tweet.save()
        //delete comment document
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({message: 'comment deleted successfully'});
    } catch (err) {
        next(err);
    }
};

export const likeComment = async (req, res) => {
    try {
        const {commentId} = req.params;
        const userId = req.user?.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({error: 'comment not found'});
        }
        const alreadyLiked = comment.likes.includes(userId);
        if (alreadyLiked) {
            //uunlike
            comment.likes.pull(userId);
        } else {
            //like
            comment.likes.push(userId);
        }

        await comment.save();
        res.status(200).json({
            message: alreadyLiked ? 'comment unliked' : 'comment liked',
            likesCount: comment.likes.length
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const replyToComment = async (req, res, next) => {
    try {
        const validator = new Validator();
        const {error, value} = validator.validate(commentRequest, req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }

        const {tweetId, commentId: parentCommentId} = req.params;
        console.log('parent comment id:', parentCommentId)
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({error: 'tweet not found'});
        }
        //check if parentComment exists
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            return res.status(404).json({error: 'parent comment not found'});
        }
        //create reply comment
        const reply = await Comment.create({
            tweetId,
            author: value.author,
            content: value.content,
            parentCommentId
        });

        tweet.comments.push(reply._id);
        await tweet.save();

        const populatedReply = await Comment.findById(reply._id).populate('parentCommentId');

        res.status(201).json({
            message: 'reply added',
            data: reply
        });
    } catch (err) {
        next(err);
    }
};