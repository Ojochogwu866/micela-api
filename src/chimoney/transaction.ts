import express from 'express';
import axios from "axios";
import nodemailer from 'nodemailer';

const CHIMONEY_API_BASE_URL = 'https://api-v2-sandbox.chimoney.io/v0.2/';

/**
 * Send money via email function
 * @param req 
 * @param res 
 * @returns 
 */
export const sendMoneyViaEmail = async (req: express.Request, res: express.Response) => {
    try {
        const { email, valueInUSD } = req.body;
        if (!email || !valueInUSD) {
            return res.status(400).json({ error: 'All values are required' });
        }
        const apiKey = process.env.CHIMONEY_API_KEY;
        if (!apiKey) {
            throw new Error('Chi-Money API key not provided');
        }
        
        const response = await axios.post(
            `${CHIMONEY_API_BASE_URL}/payouts/chimoney`,
            { chimoneys: [{
                email, 
                valueInUSD,         
                redeemData: {
                    walletID: "",
                    interledgerWalletAddress: 'zedeki',
                }
            }]},
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-KEY': apiKey
                },
            }
        );
        
        if (response.status === 200) {
            await sendEmailNotification(email, valueInUSD);     
            return res.status(200).json({ success: true, message: 'Payment sent via email successfully' });
        } else {
            throw new Error('Failed to send payment via email');
        }
    } catch (error) {
        console.error('Error sending money via email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const sendEmailNotification = async (email: string, amount: number) => {
    try {
        const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port : 587,
                secure: false, 
                auth: {
                    user: process.env.email, 
                    pass: process.env.password
                }
        });

        const mailOptions = {
            from: 'chi@you.com',
            to: email,
            subject: 'Payment Received',
            html: `<p>You have received a payment of ${amount} USD.</p>
                   <p>To cash out the money, please visit the following URL: <a href="http://example.com/cashout">Cash Out</a></p>`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email notification:', error);
        throw new Error('Failed to send email notification');
    }
};
