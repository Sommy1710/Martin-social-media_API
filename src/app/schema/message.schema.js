import mongoose, { model, Schema } from 'mongoose';

const MessageSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String }, // Made optional
    photos: [{type: String}],
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

// Ensure at least one of content or image is present
MessageSchema.pre('validate', function (next) {
    if (!this.content && !this.photos) {
        next(new Error('Message must contain either text or an image.'));
    } else {
        next();
    }
});

export const Message = model('Message', MessageSchema);