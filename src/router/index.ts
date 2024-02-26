import express from 'express';
import authentication from './authentication';
import transactions from './transactions';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    transactions(router)
    return router;
};
