import jwt from "jsonwebtoken";
import config from "../../config/app.config.js";

export const generateAuthenticationToken = (payload) => {
    return jwt.sign(payload, config.jwt.secret, {expiresIn: `${config.jwt.expiration}s`});
};

export const verifyAuthenticationToken = (token) => {
    return jwt.verify(token, config.jwt.secret);
};


/*
this code above 
the function takes PAYLOAD oject as an imput
it uses the jwt.sign() method to generate a new JWT 
the JWT is signed with a secret key, stored in config.jwt.secret 
*/