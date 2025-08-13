import { UnauthenticatedError } from "../../lib/error-definitions.js";
import {getOperationType, permissions} from "../../lib/util.js"

export default function authorizationMiddleware  (req, res, next)
{
    try {
        const user = req.user;

        //check the route the user is accessing
        const route = req.baseUrl.split('/')[3];

        let operation = getOperationType(req.method.toLowerCase());
         //check the route being accessed against the routes the user can access
        
        if(permissions[route][operation].includes(user.role)) {
           return next();
        }
        throw new UnauthenticatedError('you do not have the permission to access this resource');
            
    }
    catch (error) 
    {
        next (error)
    }
}