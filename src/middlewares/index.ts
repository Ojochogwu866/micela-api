import express from 'express';
import { get } from 'lodash';
import { UserModel } from '../Models/user';

declare global {
    namespace Express {
        interface Request {
            identity?: any;
        }
    }
}

//retrieve user by session token
export const getUserBySessionToken = async (sessionToken: string): Promise<any> => {
    try {
        const user = await UserModel.findOne({ 'authentication.sessionToken': sessionToken });
        return user; 
    } catch (error) {
        console.error('Error fetching user by session token:', error);
        throw new Error('Failed to fetch user by session token');
    }
};


/**
 * check resource owner
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId || currentUserId !== id) {
            return res.sendStatus(403); 
        }
        next();
    } catch (error) {
        console.error('Error in isOwner middleware:', error);
        return res.sendStatus(500); 
    }
}


/**
 * check if the user is authenticated.
 * @param {express.Request} req 
 * @param {express.Response} res
 * @param {express.NextFunction} next 
 */
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['chimoney-auth'];
        
        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        req.identity = existingUser;
        next();
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        return res.sendStatus(500);
    }
}
