import * as tweetService from '../services/tweet.service.js';
import {asyncHandler} from '../../lib/util.js';
import {Validator} from './../../lib/validator.js';
import { CreateTweetRequest } from '../requests/create-tweet.request.js';
import { ValidationError } from '../../lib/error-definitions.js';
import { Tweet } from '../schema/tweet.schema.js';

export const createNewTweet = asyncHandler(async(req, res) =>
{
    const validator = new Validator();
    const {errors, value} = validator.validate(CreateTweetRequest, req.body);
    if (errors) throw new ValidationError('the request failed with the following errors', errors);

    await tweetService.createTweet(value);

    return res.status(201).json({
        success: true,
        message: 'new tweet created'
    })

});

export const fetchAllTweets = asyncHandler(async(req, res) =>
{
    const tweets = Object.entries(req.query).length >= 1
    ? await tweetService.getTweet(req.query)
    : await tweetService.getTweet()

    return res.status(201).json({
        success: true,
        message: 'tweets retrieved',
        data: {
            tweets
        }
    })

});

export const fetchTweet = asyncHandler(async(req, res) => 
{
    const {id} = req.params;
    const tweet = await tweetService.getTweets(id);
    
    return res.json({
        success: true,
        message: 'tweet retrieved',
        data: {
            tweet
        }
    })

});

export const updateSingleTweet = asyncHandler(async(req, res) =>
{
    const {id} = req.params;
    const validator = new Validator()
    const {errors, value} = validator.validate(CreateTweetRequest, req.body);

    if (errors) throw new ValidationError('the request failed with the following errors', errors);
    await tweetService.updateTweet(id, value)

    return res.json({
        success: true,
        message: "tweet updated"
    });
});

export const deleteSingleTweet = asyncHandler(async(req, res) =>
{
    const {id} = req.params;
    await tweetService.deleteTweet(id);
    return res.json({
        success: true,
        message: "tweet deleted"
    });
});

export const toggleLike = async (req, res) => {
    console.log('req.user', req.user)
    const {tweetId} = req.params;
    const userId = req.user?.id;
    if (!userId) {
  return res.status(400).json({ message: 'User ID missing from request' });
}

    try {
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) return res.status(404).json({message: 'tweet not found'});

        const hasLiked = tweet.likes.includes(userId);

        if (hasLiked) {
            //unlike
            tweet.likes.pull(userId);
        } else {
            tweet.likes.push(userId);
        }

        await tweet.save();
        res.status(200).json({
            liked: !hasLiked,
            //If the user hadn't liked it before, this becomes true (they just liked it).
            // If the user had already liked it, this becomes false (they just unliked it).
            totalLikes: tweet.likes.length,
            likes: tweet.likes
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};