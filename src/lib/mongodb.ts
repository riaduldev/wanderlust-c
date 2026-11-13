import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  mongoose?: MongooseCache;
};

export function isMongoConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local to enable the database.",
    );
  }

  const cached = globalForMongoose.mongoose;

  if (cached?.connection) {
    return cached.connection;
  }

  if (!cached) {
    globalForMongoose.mongoose = { connection: null, promise: null };
  }

  const promise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    dbName: process.env.MONGODB_DB || undefined,
  });

  globalForMongoose.mongoose!.promise = promise;

  try {
    const connection = await promise;
    globalForMongoose.mongoose!.connection = connection;
    return connection;
  } catch (error) {
    globalForMongoose.mongoose!.promise = null;
    throw error;
  }
}
