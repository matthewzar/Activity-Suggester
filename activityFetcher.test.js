import axios from 'axios';
import { RemoteActivityFetcher } from './activityFetcher.js';
import { findSuitableActivity } from './serverUtils.js';

jest.mock('axios');
jest.mock('./serverUtils');

describe('ActivityFetcher', () => {
    describe('RemoteActivityFetcher', () => {
        const url = 'https://www.boredapi.com/api/activity';
        let remoteFetcher;

        beforeEach(() => {
            remoteFetcher = new RemoteActivityFetcher(url);
        });

        it('returns a suitable activity when found', async () => {
            const mockUser = { accessibility: 'High', price: 'Free' };
            const mockActivity = {
                accessibility: 0.2,
                price: 0,
                activity: 'Reading'
            };
            axios.get.mockResolvedValue({ data: mockActivity });
            findSuitableActivity.mockReturnValue(mockActivity);

            const activity = await remoteFetcher.getActivityForUser(mockUser);
            expect(activity).toEqual(mockActivity);
        });

        it('throws an error when no suitable activity is found', async () => {
            const mockUser = { accessibility: 'Low', price: 'High' };
            axios.get.mockResolvedValue({ data: {} });
            findSuitableActivity.mockReturnValue(null);

            await expect(remoteFetcher.getActivityForUser(mockUser)).rejects.toThrow('No suitable activity found');
        });
    });
});