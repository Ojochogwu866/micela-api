import crypto from 'crypto';
const SECRET = process.env.SECRET || '';

/**
 * Generates a random string of specified length.
 * @param {number} length The length of the random string to generate.
 * @returns {string} The generated random string.
 */

export const generateRandomString = (length: number): string => {
    return crypto.randomBytes(length).toString('base64');
};



/**
 * Hashes the password using HMAC with SHA-256 algorithm and a secret.
 * @param {string} password The password to hash.
 * @param {string} salt The salt value to use for hashing.
 * @returns {string} The hashed password.
 * @throws {Error} If an error occurs during hashing.
 */

export const hashPassword = (password: string, salt: string): string => {
    try {
        return crypto.createHmac('sha256', `${salt}/${password}`).update(SECRET).digest('hex');
    } catch (error) {
        throw new Error("Failed to hash password");
    }
};
