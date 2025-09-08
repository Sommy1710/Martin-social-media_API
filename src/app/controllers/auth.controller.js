import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../../lib/util.js';
import { Validator } from '../../lib/validator.js';
import { CreateUserRequest } from '../requests/create-user.request.js';
import {UnauthorizedError, ValidationError} from "../../lib/error-definitions.js"
import { AuthUserRequest } from '../requests/auth-user.request.js';
import config from '../../config/app.config.js';
import { User } from '../schema/user.schema.js';
import { v2 as cloudinary } from 'cloudinary';
import { deleteUserById } from '../services/user.service.js';



/*export const createUserAccount = asyncHandler(async (req, res) => {
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
})*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createUserAccount = asyncHandler(async (req, res) => {
  const validator = new Validator();
  const { value, errors } = validator.validate(CreateUserRequest, req.body);

  if (errors) {
    throw new ValidationError(
      'The request failed with the following errors',
      errors
    );
  }

  let profilePhotoUrl = '';

  // Handle image upload with a Promise
  if (req.file) {
    profilePhotoUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(new Error('Image upload failed'));
          resolve(result.secure_url);
        }
      );
      uploadStream.end(req.file.buffer);
    });
  }

  //Merge validated data with profile photo
  const userData = {
    ...value,
    profilePhoto: profilePhotoUrl,
  };

  await authService.registerUser(userData);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully!',
  });
});

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

export const searchUsers = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ success: false, message: "Keyword is required" });
  }

  const users = await User.find(
    { username: { $regex: keyword, $options: 'i' } },
    { password: 0, role: 0, email: 0 }, // this exclude password email and role field
  
  );

  return res.status(200).json({
    success: true,
    message: 'Matching users found',
    data: users
  });
});

export const deleteProfilePhoto = asyncHandler(async (req, res) => {
  const userId = req.user_id;

  const user = await User.findById(userId);
  if (!user){
    return res.status(404).json({success: false, message: 'No profile photo to delete'});
  }
  const publicIdMatch = user.profilePhoto.match(/\/([^\/]+)\.[a-z]+$/);
  const publicId = publicIdMatch ? publicIdMatch[1] : null;

  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId, {resource_type: 'image'});

    } catch (err) {
      return res.status(500).json({success: false, message: 'failed to delete profile photo'});
    }
  }
  user.profilePhoto = '';
  await user.save();
  return res.status(200).json({
    success: true,
    message: 'profile photo deleted successfully'
  });
});

/*export const deleteUserAccount = asyncHandler(async (req, res) => {
  const {userId} = req.params

  //only allow admins and super admins delete a user account
  if (!["admin", "super admin"].includes(req.user.role)) {
    throw new UnauthorizedError("you are not authorized to delete user accounts");
  }

  await deleteUserById(userId);
  res.status(200).json({
    success: true,
    message: "user account deleted"
  });
});*/

export const deleteUserAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requester = req.user;

  // Allow if requester is admin or super admin
  const isAdmin = ['admin', 'super admin'].includes(requester.role);

  //  Allow if requester is deleting their own account
  const isSelf = requester.id === userId;

  if (!isAdmin && !isSelf) {
    throw new UnauthorizedError("You are not authorized to delete this account");
  }

  const deleted = await deleteUserById(userId);

  res.status(200).json({
    success: true,
    message: "User account deleted successfully"
  });
});