# Activity Suggester

A short live takehome project. This repo will be made private within 2 weeks of creation.

 ## Assumptions

 ## Setup

  - Make sure you have Node.js installed
  - Install dependencies:
    -- `npm install express`
    -- `npm install --save-dev jest`  
    -- `npm install --save-dev supertest`
    -- `npm install --save-dev jest axios-mock-adapter`
    -- `npm install --save-dev @babel/cli`
    -- `npm install --save-dev @babel/core @babel/preset-env babel-jest`
    -- `npm install --save-dev @babel/plugin-syntax-import-meta`

 ## Running the service

From inside the project directory, run `$node index.js`
For development: `npm run dev` to start server with babel-node.
For testing: `npm test`.
For production builds: `npm run build` to generate a production-ready (ish) version.

 ## Using the service / manual testing

Run the following request in Postman (or your preferred equivalent)

 ### Posting a new user:

POST http://localhost:3000/user
body, raw JSON:
```json
{
  "name": "John",
  "accessibility": "High",
  "price": "Free"
}
```

 ### Getting an activity:

GET http://localhost:3000/activity

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

Since this endpoint reacts based on the last posted user profile, make sure to use/test it after posting a user profile to see how it filters activities.


