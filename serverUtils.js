import axios from 'axios';

export async function getActivityForUser(user) {
    const response = await axios.get('https://www.boredapi.com/api/activity');
    const activities = [response.data];
    const suitableActivity = findSuitableActivity(activities, user);
    if (!suitableActivity) {
        throw new Error('No suitable activity found');
    }
    return suitableActivity;
}

export function findSuitableActivity(activities, user) {
    console.log("Activities: ", activities);  // Debug log
    console.log("User: ", user);  // Debug log
    return activities.find(activity => {
        const activityAccessibility = mapAccessibility(activity.accessibility);
        const activityPrice = mapPrice(activity.price);
        console.log("Mapped Accessibility: ", activityAccessibility);  // Debug log
        console.log("Mapped Price: ", activityPrice);  // Debug log
        return activityAccessibility === user.accessibility && activityPrice === user.price;
    });
}

export function formatActivityResponse(activity) {
    return {
        activity: activity.activity,
        accessibility: mapAccessibility(activity.accessibility),
        type: activity.type,
        participants: activity.participants,
        price: mapPrice(activity.price),
        link: activity.link,
        key: activity.key
    };
}

export function mapAccessibility(accessibility) {
    if (accessibility <= 0.25) return 'High';
    else if (accessibility > 0.75) return 'Low';
    return 'Medium';
}

export function mapPrice(price) {
    if (price === 0) return 'Free';
    else if (price <= 0.5) return 'Low';
    return 'High';
}