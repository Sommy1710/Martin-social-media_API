import mongoose, {model, Schema} from 'mongoose';

const MessageSchema = new Schema ({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: {type: Boolean, default: false}
})

export const Message = model('Message', MessageSchema);