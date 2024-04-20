import axios from 'axios';
import { findSuitableActivity } from './serverUtils.js';


export class IActivityFetcher {
    async getActivityForUser(user) {
        throw new Error('getActivityForUser must be implemented by subclasses');
    }
}

export class RemoteActivityFetcher extends IActivityFetcher {
    constructor(url = 'https://www.boredapi.com/api/activity') {
        super();
        this.url = url;
    }

    async getActivityForUser(user) {
        const response = await axios.get(this.url);
        const activities = [response.data];
        const suitableActivity = findSuitableActivity(activities, user);
        if (!suitableActivity) {
            throw new Error('No suitable activity found');
        }
        return suitableActivity;
    }
}

export class MockActivityFetcher extends IActivityFetcher {
    constructor() {
        super();
        this.mockResponses = {};
    }

    setResponseForUser(user, response) {
        this.mockResponses[user.name] = response;
    }

    async getActivityForUser(user) {
        if (this.mockResponses[user.name]) {
            return this.mockResponses[user.name];
        }
        throw new Error('No suitable activity found');
    }
}