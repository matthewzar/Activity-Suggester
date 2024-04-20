class IUserProfileManager {
    addUserProfile(name, accessibility, price) {
        throw new Error("Method not implemented.");
    }

    getLastUserProfile() {
        throw new Error("Method not implemented.");
    }

    clearProfiles() {
        throw new Error("Method not implemented.");
    }
}

class InMemoryUserProfileManager extends IUserProfileManager {
    constructor() {
        super();
        this.userProfiles = [];
    }

    addUserProfile(name, accessibility, price) {
        const userProfile = { name, accessibility, price };
        this.userProfiles.push(userProfile);
        return userProfile;
    }

    getLastUserProfile() {
        return this.userProfiles.length > 0 ? this.userProfiles[this.userProfiles.length - 1] : null;
    }

    clearProfiles() {
        this.userProfiles = [];
    }
}

export { InMemoryUserProfileManager };