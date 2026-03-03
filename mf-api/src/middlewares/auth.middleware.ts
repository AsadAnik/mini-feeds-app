import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services';
import { TokenLib } from '../lib/shared';

class AuthMiddleware {
    /**
     * VERIFY THE USER ACCESS TOKEN
     * Verifies the user's access token and populates `req.user` if valid.
     * @param req
     * @param res
     * @param next
     * @returns
     */
    static verifyUser = async (req: Request | any, res: Response | any, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Access token required' });
        }

        try {
            // Verify the access token
            const tokenLib = new TokenLib();
            const decoded: any = tokenLib.verifyToken(token);

            // User Service Object Instance
            // Fetches the user from the database
            const userService = new UserService();
            const user = await userService.findUser(decoded.id);
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'User not found' });
            }

            // Attach user to the request object
            req.user = user;
            next();

        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired access token' });
        }
    };
}

export default AuthMiddleware;