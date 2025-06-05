import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/book.route.js';
import cookieParser from 'cookie-parser';
import reviewRoutes from './routes/review.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Calling DB connection
connectDB();


// APi routes
app.use('/api/auth',authRoutes);
app.use('/api/book',bookRoutes);
app.use('/api/reviews',reviewRoutes)

// StArt server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
