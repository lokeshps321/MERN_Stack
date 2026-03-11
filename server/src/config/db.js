import mongoose from "mongoose";

const DEFAULT_DB_NAME = "petcare";
let connectionPromise;

function extractDbName(uri) {
  if (!uri) return undefined;
  const match = uri.match(/^[^?]+\/([^/?]+)(\?|$)/);
  if (!match) return undefined;
  const name = decodeURIComponent(match[1]);
  return name || undefined;
}

function parsePositiveInt(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function parseCompressors(value) {
  if (!value) return ["zlib", "snappy"];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

function buildConnectOptions(uri) {
  const uriDbName = extractDbName(uri);
  const envDbName = process.env.MONGO_DB_NAME;
  const dbName = envDbName || uriDbName || DEFAULT_DB_NAME;
  const shouldSetDbName = Boolean(envDbName) || !uriDbName;

  const options = {
    autoIndex: true,
    maxPoolSize: parsePositiveInt(process.env.MONGO_MAX_POOL_SIZE, 50),
    minPoolSize: parsePositiveInt(process.env.MONGO_MIN_POOL_SIZE, 10),
    maxIdleTimeMS: parsePositiveInt(process.env.MONGO_MAX_IDLE_TIME_MS, 10000),
    serverSelectionTimeoutMS: parsePositiveInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 10000),
    socketTimeoutMS: parsePositiveInt(process.env.MONGO_SOCKET_TIMEOUT_MS, 20000),
    connectTimeoutMS: parsePositiveInt(process.env.MONGO_CONNECT_TIMEOUT_MS, 10000),
    compressors: parseCompressors(process.env.MONGO_COMPRESSORS),
    zlibCompressionLevel: parsePositiveInt(process.env.MONGO_ZLIB_COMPRESSION_LEVEL, 6),
    readPreference: "primaryPreferred"
  };

  if (shouldSetDbName && dbName) {
    options.dbName = dbName;
  }

  return { options, dbName, uriDbName };
}

async function prewarmPool(targetSize) {
  if (!targetSize || targetSize <= 0) return;
  const db = mongoose.connection.db;
  if (!db) return;
  const warmups = Array.from({ length: targetSize }, () => db.command({ ping: 1 }));
  await Promise.allSettled(warmups);
}

async function connectOnce(uri) {
  mongoose.set("strictQuery", true);

  const { options, dbName, uriDbName } = buildConnectOptions(uri);
  const dbLabel = uriDbName ? "" : ` (db: ${dbName})`;
  console.log(`Connecting to MongoDB${dbLabel}...`);

  await mongoose.connect(uri, options);

  const poolMin = options.minPoolSize || 0;
  await prewarmPool(poolMin);

  console.log(`✓ Connected to MongoDB (${mongoose.connection.name} @ ${mongoose.connection.host})`);
  return mongoose.connection;
}

export async function connectDb(uri) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const primaryUri = uri;
    const localUri = process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/petcare";
    const allowLocalFallback = process.env.MONGO_ALLOW_LOCAL_FALLBACK === "true";

    connectionPromise = (async () => {
      try {
        return await connectOnce(primaryUri);
      } catch (primaryError) {
        console.warn(`⚠️ MongoDB connection failed: ${primaryError.message}`);
        if (!allowLocalFallback) {
          throw primaryError;
        }

        console.warn("Switching to local MongoDB...");
        await mongoose.disconnect().catch(() => {});
        return await connectOnce(localUri);
      }
    })();
  }

  return connectionPromise;
}
