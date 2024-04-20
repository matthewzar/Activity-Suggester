export function findSuitableActivity(activities, user) {
    return activities.find(activity => {
        const activityAccessibility = mapAccessibility(activity.accessibility);
        const activityPrice = mapPrice(activity.price);
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