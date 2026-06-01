import mongoose from "mongoose";

// Define type for mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global namespace
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI or DATABASE_URL environment variable"
  );
}

// Vérifier le format de l'URI
if (
  !MONGODB_URI.startsWith("mongodb://") &&
  !MONGODB_URI.startsWith("mongodb+srv://")
) {
  console.error("Invalid MONGODB_URI format:", MONGODB_URI);
  throw new Error(
    'MONGODB_URI must start with "mongodb://" or "mongodb+srv://"'
  );
}

// Assertion de type pour indiquer à TypeScript que MONGODB_URI n'est pas undefined
const mongoUri: string = MONGODB_URI;

// Initialize cached with a default value to avoid 'possibly undefined' errors
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached.conn && !cached.promise) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
