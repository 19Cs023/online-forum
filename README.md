# MERN Skeleton

This is a robust, full-stack MERN (MongoDB, Express, React, Node.js) boilerplate application. Keep your development momentum high by using this solid foundation structure for your next big idea!

## Features

- **Frontend:** Built with React 19, powered by Vite for blazing-fast builds.
- **State Management:** Zustand to easily interact with the global state (including authentication hooks).
- **Form Handling & Validation:** `react-hook-form` paired with `zod` for robust data integrity and user experience.
- **Backend:** Node.js with Express API.
- **Database:** MongoDB integration using Mongoose models.
- **Authentication:** Pre-configured secure User Registration, Sign In, and Sign Out operations.

## Project Structure

- `frontend/` - React frontend application.
- `backend/` - Node.js/Express backend API connected to MongoDB.

## Getting Started

### Backend
1. Navigate to the `backend/` folder: `cd backend`
2. Install dependencies: `npm install`
3. Configure your environment variables if necessary (e.g., `MONGO_URI`, `JWT_SECRET`).
4. Run the backend in development mode: `npm run dev`
*(Requires MongoDB running locally on port 27017, or set the MONGO_URI environment variable).*

### Frontend
1. Navigate to the `frontend/` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Run the frontend in development mode: `npm run dev`

## Built With
- **Frontend**: React, React Router DOM, React Hook Form, Zod, Zustand, Axios, React Hot Toast, Vite
- **Backend**: Express, Mongoose, Express-JWT, JSONWebToken, Lodash, Cors, Dotenv, Nodemon