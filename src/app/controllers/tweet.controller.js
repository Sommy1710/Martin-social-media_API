import * as tweetService from '../services/tweet.service.js';
import {asyncHandler} from '../../lib/util.js';
import {Validator} from './../../lib/validator.js';
import { CreateTweetRequest } from '../requests/create-tweet.request.js';
import { ValidationError } from '../../lib/error-definitions.js';
import { Tweet } from '../schema/tweet.schema.js';
import { v2 as cloudinary } from 'cloudinary';
import { NotFoundError, UnauthenticatedError } from '../../lib/error-definitions.js';

/*export const createNewTweet = asyncHandler(async(req, res) =>
{
    const validator = new Validator();
    const {errors, value} = validator.validate(CreateTweetRequest, req.body);
    if (errors) throw new ValidationError('the request failed with the following errors', errors);

    await tweetService.createTweet(value);

    return res.status(201).json({
        success: true,
        message: 'new tweet created'
    })

});*/
export const createNewTweet = asyncHandler(async (req, res) => {
  let photoUrls = [];

  // Upload photos first
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }).end(file.buffer);
      });
    });

    photoUrls = await Promise.all(uploadPromises);
    req.body.photos = photoUrls; // Inject URLs into body before validation
  }

  const validator = new Validator();
  const { errors, value } = validator.validate(CreateTweetRequest, req.body);
  if (errors) throw new ValidationError('The request failed with the following errors', errors);

  const tweetPayload = {
    ...value,
    photos: photoUrls
  };

  await tweetService.createTweet(tweetPayload);

  return res.status(201).json({
    success: true,
    message: 'New tweet created',
    photos: photoUrls
  });
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

/*export const updateSingleTweet = asyncHandler(async(req, res) =>
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
});*/

/*export const deleteSingleTweet = asyncHandler(async(req, res) =>
{
    const {id} = req.params;
    await tweetService.deleteTweet(id);
    return res.json({
        success: true,
        message: "tweet deleted"
    });
});*/

export const deleteSingleTweet = asyncHandler(async (req, res) => {
    const {id} = req.params;

    //fetch the tweet you want to delete
    const tweet = await tweetService.getTweets(id);
    if (!tweet) {
        throw new NotFoundError('Tweet not found');
    }
    //check if the authenticated user is the author
    if (tweet.author.toString() !== req.user.id) {
        throw new UnauthenticatedError('you are not authorized to delete this tweet');
    }

    //pr;oceed with deletion
    await tweetService.deleteTweet(id);

    return res.json({
        success: true,
        message: 'Tweet deleted'
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

export const searchTweets = asyncHandler(async (req, res) => {
    const {keyword} = req.query;

    if (!keyword) {
        return res.status(400).json({success: false, message: 'keyword is required'});
    }

    const tweets = await Tweet.find({
        content: {$regex: keyword, $options: 'i'} // this is for case-insensitive search
    }).populate('author', 'username'); // this includes username in response

    return res.status(200).json({
        success: true,
        message: 'Matching tweets found',
        data: tweets
    });
});