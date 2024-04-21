import url from 'url';
import { Server } from './server.js';
import { InMemoryUserProfileManager } from './userProfileManager.js';
import { RemoteActivityFetcher } from './activityFetcher.js';

// Inject a more persistent DB type for actual deployment
const profileManager = new InMemoryUserProfileManager();
const activityFetcher = new RemoteActivityFetcher();
const server = new Server(profileManager, activityFetcher);

const currentFileUrl = import.meta.url;
const expectedFileUrl = url.pathToFileURL(process.argv[1]).href;

if (currentFileUrl === expectedFileUrl) {
    const port = 3000;
    server.listen(port, () => console.log(`Server running on port ${port}`));
}