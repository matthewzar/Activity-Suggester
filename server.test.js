import request from 'supertest';
import Server from './server';
import { InMemoryUserProfileManager } from './userProfileManager';
import { MockActivityFetcher } from './activityFetcher';

describe('Server Functionality', () => {
    let profileManager;
    let mockActivityFetcher;
    let server;
    let app;

    beforeEach(() => {
        // Not a true mock, but simple enough to work as one.
        profileManager = new InMemoryUserProfileManager();
        mockActivityFetcher = new MockActivityFetcher();
        server = new Server(profileManager, mockActivityFetcher);
        app = server.app;
        profileManager.clearProfiles();
    });

    describe('POST /user endpoint', () => {
        it('should create a user and return 201', async () => {
            const userData = { name: 'John Doe', accessibility: 'Medium', price: 'Low' };
            const response = await request(app)
                .post('/user')
                .send(userData)
                .expect(201);

            expect(response.text).toEqual('User profile created');
        });

        it('should return 400 if missing fields', async () => {
            const userData = { name: 'John Doe', accessibility: 'Medium' }; // Missing price
            const response = await request(app)
                .post('/user')
                .send(userData)
                .expect(400);

            expect(response.text).toEqual('Missing required fields');
        });

        it('should return 400 if data types are incorrect', async () => {
            const userData = { name: 123, accessibility: true, price: true };
            const response = await request(app)
                .post('/user')
                .send(userData)
                .expect(400);

            expect(response.text).toEqual('Invalid data types');
        });
    });

    describe('GET /activity endpoint', () => {
        it('should return an activity if a user profile exists', async () => {
            const userData = { name: 'Alice', accessibility: 'High', price: 'Free' };
            profileManager.addUserProfile(userData.name, userData.accessibility, userData.price);
            mockActivityFetcher.setResponseForUser(userData, { activity: 'Skydiving' });

            const response = await request(app)
                .get('/activity')
                .expect(200);

            expect(response.body).toHaveProperty('activity', 'Skydiving');
        });

        it('should return 404 if no user profiles are available', async () => {
            const response = await request(app)
                .get('/activity')
                .expect(404);

            expect(response.text).toEqual('No user profiles available');
        });

        it('should handle errors properly when fetching activities fails', async () => {
            profileManager.addUserProfile('Bob', 'Medium', 'Low');
                    
            jest.spyOn(mockActivityFetcher, 'getActivityForUser').mockImplementation(() => {
                throw new Error('No suitable activity found');
            });
        
            const response = await request(app)
                .get('/activity')
                .expect(404);

            expect(response.text).toEqual('No suitable activity found');
        });
    });
});