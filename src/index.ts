// Import necessary modules and packages
import express from 'express';
import session from 'express-session';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs';

import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

import mongoose from 'mongoose'
import router from './router';
import dotenv from 'dotenv';

import errorHandler from './middlewares/errorHandler'

dotenv.config();

// Load Swagger documentation from YAML file
const swaggerDocument = YAML.load("./swagger.yaml");

// Set up rate limiting for API requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 100,  // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

// Create an Express application
const app = express();

// Use security-related middleware
app.use(helmet());
app.use(limiter)
app.use(cors({ credentials: true }));
app.use(compression());

// Parse incoming JSON requests
app.use(bodyParser.json());
app.use(cookieParser());

app.use(errorHandler);
// Create an HTTP server using Express

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

const server = http.createServer(app)

// Start the server and listen on port 8080
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
})

// Set up MongoDB connection
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/api/v1', router());
app.get("/api/v1", (req, res) => {
  res.send('<h1>You read API</h1><a href="/api/v1/api-docs">Documentation</a>');
});

app.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
export default app;