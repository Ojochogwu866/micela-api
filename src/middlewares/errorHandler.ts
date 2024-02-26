// errorHandler.ts
import express from 'express';

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;
