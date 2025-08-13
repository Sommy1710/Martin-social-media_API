import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../../lib/util.js';
import { Validator } from '../../lib/validator.js';
import { CreateUserRequest } from '../requests/create-user.request.js';
import {ValidationError} from "../../lib/error-definitions.js"
import { AuthUserRequest } from '../requests/auth-user.request.js';
import config from '../../config/app.config.js';



export const createUserAccount = asyncHandler(async (req, res) => {
    const validator = new Validator();

    const {value, errors} = validator.validate(CreateUserRequest, req.body);

    if (errors)
        throw new ValidationError(
    "the request failed with the following errors",
    errors
    )

    await authService.registerUser(value);



    

    return res.status(201).json({
        success: true,
        message: 'user registered successfully',
    })
})

export const authenticateUser = asyncHandler(async (req, res) => 
{
    const validator = new Validator();

    const {value, errors} = validator.validate(AuthUserRequest, req.body);

    if (errors) throw new ValidationError("the request failed with the followig errors", errors);

    const token = await authService.authenticateUser(value, req);

    res.cookie("authentication", token);

    return res.status(200).json({success: true, message: "user successfully logged in"});
});

export const getAuthenticatedUser = asyncHandler(async(req, res) =>
{
    const user = req.user;
    return res.status(200).json({
        success: true,
        message: "user found successfully",
        data: {
            user
        },
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('authentication', {
    httpOnly: true,
    secure: config.environment === 'production',
    sameSite: 'Strict'
  });

  return res.status(200).json({ success: true, message: 'User successfully logged out' });
});
