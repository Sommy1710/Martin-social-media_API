import Joi from 'joi';

export const commentRequest = Joi.object({
    author: Joi.string().required(),
    content: Joi.string().min(1).max(500).required()
});