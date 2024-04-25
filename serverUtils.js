export function findSuitableActivity(activities, user) {
    return activities.find(activity => {
        const activityAccessibility = mapAccessibility(activity.accessibility);
        const activityPrice = mapPrice(activity.price);
        return activityAccessibility === user.accessibility && activityPrice === user.price;
    });
}

export function formatActivityResponse(activity) {
    return { 
        ...activity,
        accessibility: mapAccessibility(activity.accessibility),
        price: mapPrice(activity.price),
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

export function invertAccessibility(accessibility) {
    return { minAccessibility: 0.25, maxAccessibility: 0.75 };
    if (accessibility === 'High') return { minAccessibility: 0, maxAccessibility: 0.25 };
    else if (accessibility === 'Low') return { minAccessibility: 0.75, maxAccessibility: 1 };
    return { minAccessibility: 0.25, maxAccessibility: 0.75 };
}

export function invertPrice(price) {
    if (price === 'Free') return { minPrice: 0, maxPrice: 0 };
    else if (price.toLowerCase() === 'Low') return { minPrice: 0.0, maxPrice: 0.5 };
    return { minPrice: 0.5, maxPrice: 1 };
}