import {aggregateResults} from "../../lib/util.js";
import { Tweet } from "../schema/tweet.schema.js";

export const createTweet = async (payload) => {
    return await Tweet.create(payload);
};

export const getTweet = async (payload) => {
    return (payload) ? await aggregateResults(Tweet, payload) : await Tweet.find()
};

export const getTweets = async (id) => {
    return await Tweet.findById(id)
};

export const updateTweet = async (id, payload) => {
    return await Tweet.findByIdAndUpdate(id, payload, {new: true});
};

export const deleteTweet = async (id) => {
    return await Tweet.findByIdAndDelete(id);
};