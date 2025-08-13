import mongoose, {model, Schema} from 'mongoose';

const commentSchema = new Schema({
    tweetId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true},
    author: {type: String, required: true},
    content: {type: String, required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    createdAt: {type: Date, default: Date.now},
    parentCommentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null}
});

export const Comment = model('Comment', commentSchema);

