import mongoose, { model, Schema } from 'mongoose';

const TweetSchema = new Schema ({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    content: {type: String},
    photos: [{type: String}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    createdAt: {type: Date, default: Date.now}
});

TweetSchema.pre('validate', function (next) {
    if (!this.content && !this.photos) {
        next(new Error('Message must contain either text or an image.'));
    } else {
        next();
    }
});

export const Tweet = model('Tweet', TweetSchema);