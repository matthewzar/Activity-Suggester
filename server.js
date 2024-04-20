import express from 'express';
import { formatActivityResponse } from './serverUtils.js';

class Server {
    constructor(profileManager, activityFetcher) {
        this.app = express();
        this.activityFetcher = activityFetcher
        this.profileManager = profileManager;
        this.configureMiddleware();
        this.setupRoutes();
    }

    configureMiddleware() {
        this.app.use(express.json());
    }

    setupRoutes() {
        this.app.post('/user', this.createUser.bind(this));
        this.app.get('/activity', this.getActivity.bind(this));
    }

    createUser(req, res) {
        const { name, accessibility, price } = req.body;

        // Check for missing fields
        if (!name || !accessibility || !price) {
            return res.status(400).send('Missing required fields');
        }

        // Check data types
        if (typeof name !== 'string' || typeof accessibility !== 'string' || typeof price !== 'string') {
            return res.status(400).send('Invalid data types');
        }

        this.profileManager.addUserProfile(name, accessibility, price);
        res.status(201).send('User profile created');
    }

    async getActivity(req, res) {
        try {
            // Attempt to retrieve the current user's profile
            const currentUser = this.profileManager.getLastUserProfile();
            if (!currentUser) {
                return res.status(404).send('No user profiles available');
            }
    
            // Fetch an activity based on the current user's preferences
            const activity = await this.activityFetcher.getActivityForUser(currentUser);
            res.json(formatActivityResponse(activity));
        } catch (error) {
            // Differentiate between a 'no activity' error and other types of exceptions
            if (error.message === 'No suitable activity found') {
                res.status(404).send(error.message);
            } else {
                // Log the error for debugging purposes (consider using a proper logging library)
                console.error('Error while fetching activity:', error);
                res.status(500).send('Error fetching activities');
            }
        }
    }

    listen(port, callback) {
        this.app.listen(port, callback);
    }
}

export default Server;