import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

declare global {
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

export function connectDatabase() {
  if (!uri) throw new Error("MONGODB_URI is not configured");
  global.mongooseConnection ??= mongoose.connect(uri, { dbName: process.env.MONGODB_DB ?? "lume" });
  return global.mongooseConnection;
}


