import express from 'express';
import { sendMoneyViaEmail } from '../chimoney/transaction'


export default (router: express.Router) => {
    router.post('/send-payment', sendMoneyViaEmail);
};
