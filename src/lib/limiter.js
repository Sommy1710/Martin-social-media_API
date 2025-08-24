import  rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 5, // limit each IP to 5 login requests per windowMs
    message: 'too many attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});