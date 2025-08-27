import mongoose, { model, Schema } from 'mongoose';

import argon from 'argon2'

const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    profilePhoto: {type: String, default: ''},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    role: {
        type: String,
        enum: ["user", "admin", "super admin"],
        default: "user",
    }
    
}, {timestamps: true});

UserSchema.pre('save', async function(next)
{
    if (this.isModified('password'))
    {
        this.password = await argon.hash(this.password);
    }
    next();
});
 
export const User = model('User', UserSchema);