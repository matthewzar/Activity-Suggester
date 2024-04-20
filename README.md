# Activity Suggester

A short live takehome project. This repo will be made private within 2 weeks of creation.

## Assumptions

- External API Reliability: I assumed that the Bored API is consistently available and reliable. The system assumes that the API will return valid and expected data structures every time a request is made.
  * This assumption does not hold for unit testing. I've decoupled from BoredAPI via an injected activity-fetcher service.
- Simplistic Persistence: I assumed that in the interest of time a simple in-memory persistence mechanism (a mock database) which resets when the server restarts would be addequate.
  * This service was also decoupled to allow for easy replacement.
- Environment: This was developed on a Windows system with Node installed, and has not been tested elsewhere.
- Security: Given the scope of the project, security was not taken into consideration.
- Performance: Given the scope of the project, nothing has been delieberately performance-optimised.
- Testing: I assumed that the reviewer would rather not read the 50+ tests that TDD would have resulted in, so I've only covered basic cases. 

## Setup Instructions

1. **Install Node.js**: Ensure that Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/) or manage multiple versions with [nvm](https://github.com/nvm-sh/nvm).

2. **Clone the Repository**: Clone the project repository to your local machine using:
   ```bash
   git clone <repository-url>
   ```
3. Install Dependencies: Navigate to the project directory and install the necessary dependencies using `npm install`
4. Development Environment Setup: If using Babel for ES6+ support, ensure .babelrc is configured correctly.

## Running the service

- For development: `npm run dev` to start server with babel-node.
  * This will start the server on `http://localhost:3000`. 
- For testing: `npm test`.
- For production builds: `npm run build` to generate a production-ready (ish) version.

## Using the service and manual testing

Run the following request in Postman (or your preferred equivalent):

### Posting a new user:

POST -> http://localhost:3000/user

body, raw JSON:
```json
{
  "name": "John",
  "accessibility": "High",
  "price": "Free"
}
```

### Getting an activity:

Since this endpoint reacts based on the last posted user profile, make sure to use/test it after posting adding a user profile to see how it filters activities.

GET -> http://localhost:3000/activity

Example expected respose
```json
{
    "activity": "Read a formal research paper on an interesting subject",
    "accessibility": "High",
    "type": "education",
    "participants": 1,
    "price": "Free",
    "link": "",
    "key": "3352474"
}
```

## API Endpoint Details

**POST /user**: Creates a new user profile. Expects the following JSON payload:
  ```json
  {
    "name": "John",
    "accessibility": "High",
    "price": "Free"
  }
  ```

Responses:
 - 201 Created: User profile created successfully.
 - 400 Bad Request: Missing or invalid data in request.

**GET /activity**: Fetches an activity based on the last user profile's preferences.

Responses:
 - 200 OK: Activity details as shown in the example.
 - 404 Not Found: No activities found that match the user's preferences.
