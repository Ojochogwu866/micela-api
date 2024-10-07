// Import necessary modules and packages
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import http from 'http';
// import swaggerUI from 'swagger-ui-express'
// import YAML from 'yamljs';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import errorHandler from './middlewares/errorHandler';
import router from './router';

dotenv.config();

// const swaggerDocument = YAML.load("./swagger.yaml");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	validate: {
		xForwardedForHeader: false,
		default: true,
	},
});
const app = express();

// Use security-related middleware
app.use(helmet());
app.use(limiter);
app.use(cors({ credentials: true }));
app.use(compression());

// Parse incoming JSON requests
app.use(bodyParser.json());
app.use(cookieParser());

app.use(errorHandler);
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

const server = http.createServer(app);
server.listen(8080, () => {
	console.log('Server running on http://localhost:8080');
});

// Set up MongoDB connection
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/api/v1', router());
app.get('/api/v1', (req, res) => {
	res.send('<h1>You read API</h1><a href="/api/v1/api-docs">Documentation</a>');
});
// app.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default app;
