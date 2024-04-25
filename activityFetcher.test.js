import axios from 'axios';
import { RemoteActivityFetcher } from './activityFetcher.js';
import { findSuitableActivity, invertAccessibility } from './serverUtils.js';

jest.mock('axios');
jest.mock('./serverUtils');

// As this test talks to a 3rd party service, using both RemoteActivityFetcher and findSuitableActivity, it's not *strictly* a unit test.
// I'm keeping this integration-focused test in the interest of test coverage
describe('ActivityFetcher', () => {
    describe('RemoteActivityFetcher', () => {
        const url = 'https://www.boredapi.com/api/activity';
        let remoteFetcher;

        beforeEach(() => {
            remoteFetcher = new RemoteActivityFetcher(url, 1);
        });

        it('returns a suitable activity when found', async () => {
            const mockUser = { name:"Tim", accessibility: 'Medium', price: 'Low' };
            const mockActivity = {
                accessibility: 0.5,
                price: 0,
                activity: 'Cycling'
            };
            axios.get.mockResolvedValue({ data: mockActivity });
            findSuitableActivity.mockReturnValue(mockActivity);
            invertAccessibility.mockReturnValue( { minAccessibility: 0.25, maxAccessibility: 0.75 } )

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