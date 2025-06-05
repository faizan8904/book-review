import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Calling DB connection
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
