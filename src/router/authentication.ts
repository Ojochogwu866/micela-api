import express from 'express';
import {
	login,
	register,
	updateGithubUsername,
} from '../controllers/authentication';

export default (router: express.Router) => {
	router.post('/register', register);
	router.post('/login', login);
	router.patch('/update-github', updateGithubUsername);
};
