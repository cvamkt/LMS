import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const connectionToDB = async () => {
  try {
    const { connection } = await mongoose.connect(
      "mongodb+srv://shivamkr825311:saro9771@cluster2.975ze.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster2",  {
        serverSelectionTimeoutMS: 30000, // 30 seconds for initial connection
        socketTimeoutMS: 45000, // 45 seconds for waiting for a response
      }
    );

    if (connection) {
      console.log(`Connected to MongoDB at ${connection.host}`);
    }
  } catch (e) {
    console.error('Database connection error:', e.message || e);
    process.exit(1); // Exit with failure
  }
};

export default connectionToDB;
