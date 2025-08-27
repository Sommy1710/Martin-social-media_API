import mongoose, { model, Schema } from 'mongoose';

const TweetSchema = new Schema ({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    content: {type: String, required: true},
    photos: [{type: String}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    createdAt: {type: Date, default: Date.now}
});

export const Tweet = model('Tweet', TweetSchema);