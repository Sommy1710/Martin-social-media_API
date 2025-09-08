import Joi from 'joi';

export const commentRequest = Joi.object({
    content: Joi.string().min(1).max(500).required()
});