import {Router} from 'express';
import {createUserAccount, getAuthenticatedUser, authenticateUser, logoutUser} from '../app/controllers/auth.controller.js';
import authMiddleware from '../app/middleware/auth.middleware.js';
import authorizationMiddleware from '../app/middleware/authorization.middleware.js';
const router = Router();

router.post('/register', createUserAccount);
router.post("/login", authenticateUser);
router.get("/user", authMiddleware,  getAuthenticatedUser)
router.post("/logout", logoutUser);

export const authRouter = router;