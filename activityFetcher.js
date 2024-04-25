import axios from 'axios';
import { findSuitableActivity, invertAccessibility } from './serverUtils.js';


export class IActivityFetcher {
    async getActivityForUser(user) {
        throw new Error('getActivityForUser must be implemented by subclasses');
    }
}

export class RemoteActivityFetcher extends IActivityFetcher {
    constructor(url = 'https://www.boredapi.com/api/activity', maxRetries = 5, delay = 100) {
        super();
        this.url = url;
        this.maxRetries = maxRetries;
        this.delay = delay;
    }

    async getActivityForUser(user) {        
        for (let i = 0; i <= this.maxRetries; i++) {
            try {
                const thing = invertAccessibility(user.accessibility);
                const { minAccessibility, maxAccessibility } = thing
                const url = `${this.url}?minaccessibility=${minAccessibility}&maxaccessibility=${maxAccessibility}`;
                
                const response = await axios.get(url);
                const activity = [response.data];
                const suitableActivity = findSuitableActivity(activity, user);
                
                if (suitableActivity) {
                    return suitableActivity;
                }
            } catch (error) {
                console.error(`Attempt ${i + 1}: Failed to fetch activity`, error);
            }
    
            // Wait for a delay before retrying, using exponential backoff
            await new Promise(resolve => setTimeout(resolve, this.delay * (i + 1)));  
        }
        
        throw new Error('No suitable activity found');
    }

    async getActivityForUser_old(user) {
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                const response = await axios.get(this.url);
                const activities = [response.data];
                const suitableActivity = findSuitableActivity(activities, user);
                
                if (suitableActivity) {
                    return suitableActivity;
                }
            } catch (error) {
                console.error(`Attempt ${i + 1}: Failed to fetch activity`, error);
            }

            // Wait for a delay before retrying, using exponential backoff
            await new Promise(resolve => setTimeout(resolve, this.delay * (i + 1)));  
        }
        
        throw new Error('No suitable activity found');
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