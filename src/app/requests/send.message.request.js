import Joi from 'joi';
export const sendMessageRequest = Joi.object({
    sender: Joi.string().required(),
    receiver: Joi.string().required(),
    content: Joi.string().min(1).max(1000).required(),
});