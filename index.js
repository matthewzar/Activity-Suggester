import url from 'url';
import Server from './server.js';
import { InMemoryUserProfileManager } from './UserProfileManager.js';

// Inject a more persistent DB type for actual deployment
const profileManager = new InMemoryUserProfileManager();
const server = new Server(profileManager);

const currentFileUrl = import.meta.url;
const expectedFileUrl = url.pathToFileURL(process.argv[1]).href;

if (currentFileUrl === expectedFileUrl) {
    const port = 3000;
    server.listen(port, () => console.log(`Server running on port ${port}`));
}