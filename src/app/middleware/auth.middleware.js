import {UnauthenticatedError} from "../../lib/error-definitions.js";
import { verifyAuthenticationToken } from "../providers/jwt.provider.js";

export default function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.authentication;
    const decoded = verifyAuthenticationToken(token);
    req.user = decoded;
    next();
    } catch (error) {
        throw new UnauthenticatedError('invalid or missing token');
    }
}



/*export default function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.authentication;

    if (!token) {
      throw new UnauthenticatedError("Authentication token missing");
    }

    const decoded = verifyAuthenticationToken(token);

    if (!decoded || !decoded.id) {
      throw new UnauthenticatedError("Invalid authentication token");
    }

    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    next(new UnauthenticatedError("Invalid or missing token"));
  }
}*/