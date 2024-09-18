import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import UserRoutes from './Routes/UserRoutes.js'
import BlogRoutes from './Routes/BlogRoutes.js'


dotenv.config(); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/blogs', BlogRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogapp';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); 
  });
