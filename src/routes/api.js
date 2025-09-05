import {Router} from 'express';
import {createUserAccount, getAuthenticatedUser, authenticateUser, logoutUser, searchUsers, deleteProfilePhoto} from '../app/controllers/auth.controller.js';
import authMiddleware from '../app/middleware/auth.middleware.js';
import { limiter } from '../lib/limiter.js';
import upload from '../app/controllers/upload.js';
import uploadImage from '../app/controllers/uploadController.js';
import authorizationMiddleware from '../app/middleware/authorization.middleware.js';
const router = Router();

router.post('/register', upload.single('profilePhoto'), createUserAccount);
router.post("/login", limiter, authenticateUser);
router.get('/search', authMiddleware, searchUsers);
router.get("/user", authMiddleware,  getAuthenticatedUser);
router.delete('/profile-photo', authMiddleware, deleteProfilePhoto);
router.post("/logout", logoutUser);

export const authRouter = router;