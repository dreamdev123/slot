import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose
      .connect(MONGO_URI!, opts)
      .then((mongoose) => {
        console.log("New database connection established");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("Database connection successful");
    return cached.conn;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export default connectMongo;
