# Student Tracker Frontend

This is the frontend application for the Student Tracker.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a .env file with:
```
VITE_API_BASE_URL=https://student-tracker-server.onrender.com/api
```

3. Start the development server:
```bash
npm run dev
```

## Deployment on Vercel

1. Push your code to GitHub

2. Create a new project on Vercel:
   - Connect your GitHub repository
   - Select the client directory as the root directory
   - Set the following environment variable:
     - `VITE_API_BASE_URL`: https://student-tracker-server.onrender.com/api
   - Deploy the project

3. After deployment:
   - Update the FRONTEND_URL in your Render backend environment variables
   - The new FRONTEND_URL will be your Vercel deployment URL

## Features

- User authentication
- Job tracking
- Calendar view
- Profile management
