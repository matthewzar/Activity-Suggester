import request from 'supertest';
import Server from './server';
import { InMemoryUserProfileManager } from './UserProfileManager';

describe('Server Functionality', () => {
    // Not a true mock, but simple enough to work as one.
    let profileManager = new InMemoryUserProfileManager();
    const server = new Server(profileManager);
    let app = server.app;

    beforeEach(() => {
        profileManager.clearProfiles();
    });

    afterEach(() => {
        jest.restoreAllMocks();
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
        // TODO - fix thsi flaky test. Responses in getActivityForUser from bored api may not be consistent, that dependency needs to be mocked away
        it('should return an activity if a user profile exists', async () => {           
            profileManager.addUserProfile('Alice', 'High', 'Free'); 

            const response = await request(app)
                .get('/activity')
                .expect(200);

            // expand this to test actual data if the mock can specify it
            expect(response.body).toHaveProperty('activity');
        });

        it('should return 404 if no user profiles are available', async () => {
            const response = await request(app)
                .get('/activity')
                .expect(404);

            expect(response.text).toEqual('No user profiles available');
        });

        it('should handle errors properly when fetching activities fails', async () => {
            profileManager.addUserProfile('Bob', 'Medium', 'Low');
                    
            jest.spyOn(profileManager, 'getLastUserProfile').mockImplementation(() => {
                throw new Error('No suitable activity found');
            });
        
            const response = await request(app)
                .get('/activity')
                .expect(404);

            expect(response.text).toEqual('No suitable activity found');
        });
    });
});