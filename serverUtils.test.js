import axios from 'axios';
import {
    getActivityForUser,
    findSuitableActivity,
    formatActivityResponse,
    mapAccessibility,
    mapPrice
} from './serverUtils';

jest.mock('axios');

describe('serverUtils', () => {
    describe('getActivityForUser', () => {
        it('returns a suitable activity when found', async () => {
            const mockUser = { accessibility: 'High', price: 'Free' };
            const mockActivity = {
                accessibility: 0.2,
                price: 0,
                activity: 'Reading'
            };
            axios.get.mockResolvedValue({ data: mockActivity });
            const activity = await getActivityForUser(mockUser);
            expect(activity).toEqual(mockActivity);
        });

        it('throws an error when no suitable activity is found', async () => {
            const mockUser = { accessibility: 'Low', price: 'High' };
            const mockActivities = {
                data: {
                    accessibility: 0.1,
                    price: 0,
                    activity: 'Reading'
                }
            };
            axios.get.mockResolvedValue(mockActivities);

            await expect(getActivityForUser(mockUser)).rejects.toThrow('No suitable activity found');
        });
    });

    describe('findSuitableActivity', () => {
        it('finds and returns the activity matching user preferences', () => {
            const activities = [
                { accessibility: 0.9, price: 1, activity: 'Skydiving' },
                { accessibility: 0.1, price: 0, activity: 'Reading' }
            ];
            const user = { accessibility: 'High', price: 'Free' };
            const result = findSuitableActivity(activities, user);
            expect(result.activity).toBe('Reading');
        });
    });

    describe('formatActivityResponse', () => {
        it('formats the activity data correctly', () => {
            const activity = {
                activity: 'Jogging',
                accessibility: 0.1,
                type: 'exercise',
                participants: 1,
                price: 0,
                link: 'https://jogging.example.com',
                key: '12345'
            };
            const formatted = formatActivityResponse(activity);
            expect(formatted).toEqual({
                activity: 'Jogging',
                accessibility: 'High',
                type: 'exercise',
                participants: 1,
                price: 'Free',
                link: 'https://jogging.example.com',
                key: '12345'
            });
        });
    });

    describe('mapAccessibility', () => {
        it.each([
            [0.1, 'High'],
            [0.5, 'Medium'],
            [0.9, 'Low']
        ])('maps accessibility %f to %s', (input, expected) => {
            expect(mapAccessibility(input)).toBe(expected);
        });
    });

    describe('mapPrice', () => {
        it.each([
            [0, 'Free'],
            [0.5, 'Low'],
            [0.8, 'High']
        ])('maps price %f to %s', (input, expected) => {
            expect(mapPrice(input)).toBe(expected);
        });
    });
});