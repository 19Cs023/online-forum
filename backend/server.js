import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Environment Validation
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(`💥 CRITICAL ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please verify your .env file exists and contains these variables.');
  process.exit(1); 
}

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import commentRoutes from './routes/comments.route.js';
import { errorHandler } from './middlewares/error.middleware.js';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Development logging
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
  app.use(morgan('dev'));
}

// Secure HTTP headers
app.use(helmet());
app.use(cors());
app.use(express.json());
// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', commentRoutes)

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));