import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully to Atlas!");
  } catch (error) {
    console.log("MongoDB Atlas connection error:", error.message || error);
  }
};