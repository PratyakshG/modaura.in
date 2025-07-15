import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("Please add your Mongo URI to environment");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // if connection is already present
  if (cached.conn) return cached.conn;

  // if promise is not present, create a new one
  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then(() => mongoose.connection);
  }

  // if promise is already present
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // empty any promise that is running
    throw error;
  }

  return cached.conn;
}
