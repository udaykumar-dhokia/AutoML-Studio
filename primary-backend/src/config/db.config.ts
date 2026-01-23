import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL || "";

const connectDB = () => {
  try {
    mongoose.connect(MONGODB_URI);
    console.log("🟢 Connected to MongoDB");
  } catch (error) {
    console.log("🔴 Error connecting to MongoDB", error);
  }
};

export default connectDB;
