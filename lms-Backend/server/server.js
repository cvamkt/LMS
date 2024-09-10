import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import cloudinary from 'cloudinary';
import app from './app.js';
import connectionToDB from '../server/config/dbconnection.js';
//import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();



// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay configuration
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  // Connect to DB
  await connectionToDB();
  console.log(`App is running at http://localhost:${PORT}`);
});
