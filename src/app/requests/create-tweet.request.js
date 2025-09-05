import Joi from 'joi';
export const CreateTweetRequest = Joi.object({
    author: Joi.string().required(),
    content: Joi.string().min(1).max(280).optional(),
    photos: Joi.array().items(Joi.string().uri()).optional()
}).or('content', 'photos');