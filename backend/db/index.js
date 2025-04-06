import mongoose from "mongoose";
import { config } from "../config/config.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.dbUri);
    console.log(`MongoDB connected at: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
