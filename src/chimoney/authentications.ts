import { UserModel } from '../Models/user';
import axios from 'axios';
const CHIMONEY_API_BASE_URL = 'https://api-v2-sandbox.chimoney.io/v0.2';


interface SubAccountData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}
/**
 * CREATE SUB ACCOUNT FOR A USER IN CHI-MONEY API
 * @param {string} userId
 * @returns {Promise<any>}
 * @throws {Error}
 */
export const createSubAccount = async (userId: string, subAccountData: SubAccountData): Promise<any> => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const apiKey = process.env.CHIMONEY_API_KEY;
        if (!apiKey) {
            throw new Error('Chi-Money API key not provided');
        }
        const name = `${subAccountData.firstName} ${subAccountData.lastName}`;
        const requestData = {
            ...subAccountData,
            name, 
        };

        const response = await axios.post(
            `${CHIMONEY_API_BASE_URL}/sub-account/create`,
            requestData,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-KEY': apiKey
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating sub-account:', error);
        throw new Error('Failed to create sub-account');
    }
};

/**
 * LOGIN USING THE SUB ACCOUNT
 * @param {string} email 
 * @param {string} phoneNumber
 * @returns {Promise<boolean>}
 * @throws {Error} 
 */
export const authenticateUser = async (email: string, phoneNumber: string): Promise<string> => {
    try {
        const apiKey = process.env.CHIMONEY_API_KEY;
        if (!apiKey) {
            throw new Error('Chi-Money API key not provided');
        }
        const response = await axios.get(
            `${CHIMONEY_API_BASE_URL}/sub-account/list`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-KEY': apiKey
                }
            }
        );
        // SUCCESS RESPONSE AND AVAILABLE DATA
        if (response.data && Array.isArray(response.data.data)) {
            const subAccounts = response.data.data;
            const authenticatedUser = subAccounts.find((subAccount: any) => {
                return subAccount.email === email || subAccount.phoneNumber === phoneNumber;
            });
            if (authenticatedUser) {
                return authenticatedUser.id;
            } else {
                throw new Error('User not found in Chi-Money sub-accounts');
            }
        } else {
            throw new Error('Failed to authenticate user: Invalid response from Chi-Money API');
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw new Error('Failed to authenticate user');
    }
};