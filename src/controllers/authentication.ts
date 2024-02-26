import express from 'express';
import { getUserByEmail, createUser, getUserById  } from '../Models/user';
import { hashPassword, generateRandomString } from '../helpers';
import { createSubAccount, authenticateUser } from '../chimoney/authentications';

/**
 *Account Registration function 
 * @param req 
 * @param res 
 * @returns 
 */
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const salt = generateRandomString(16);
        const hashedPassword = hashPassword(password, salt);
        const user = await createUser({
            email,
            firstName,
            lastName,
            phoneNumber,
            authentication: {
                salt,
                password: hashedPassword
            }
        });

        const subAccountData = {
            email,
            firstName,
            lastName,
            phoneNumber
        };
        await createSubAccount(user._id, subAccountData);

        return res.status(201).json(user).end();
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Login Account: To login, the user is authenticated 
 * both on the mongoDB and from Chimony sub account API
 * @param req 
 * @param res 
 * @returns 
 */
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const isSubAccount = await authenticateUser(email, '');
        if (!isSubAccount) {
            return res.status(401).json({ error: 'Email is not registered as a sub-account' });
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const expectedHash = hashPassword(password, user.authentication.salt);
        if (user.authentication.password !== expectedHash) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const sessionToken = generateRandomString(32);
        user.authentication.sessionToken = hashPassword(sessionToken, user._id.toString());
        await user.save();

        // SECURE HTTP
        res.cookie('chi-moni-auth', sessionToken, {
            domain: 'localhost',
            path: '/',
            secure: true,
            httpOnly: true,
            sameSite: 'strict'
        });
        return res.status(200).json({ user, isSubAccount }).end();

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Feature to get paid by adding github username &&
 * Update GitHub username for a user. Was trying to do something creative.
 * May come back to it later
 * @param req 
 * @param res 
 * @returns 
 */
export const updateGithubUsername = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { githubUsername } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'User ID and GitHub username are required' });
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.githubUsername = githubUsername;
        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error updating GitHub username:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};