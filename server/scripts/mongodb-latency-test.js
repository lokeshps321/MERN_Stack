import "dotenv/config";
import dns from "dns/promises";
import { MongoClient } from "mongodb";
import { performance } from "perf_hooks";
import { execFileSync } from "child_process";

function extractHost(uri) {
  try {
    const url = new URL(uri);
    return url.hostname;
  } catch (err) {
    return undefined;
  }
}

function extractDbName(uri) {
  if (!uri) return undefined;
  const match = uri.match(/^[^?]+\/([^/?]+)(\?|$)/);
  if (!match) return undefined;
  return decodeURIComponent(match[1]) || undefined;
}

async function pingHost(host) {
  if (!host) return { ok: false, error: "missing host" };
  try {
    const output = execFileSync("ping", ["-c", "4", host], { encoding: "utf8" });
    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function testUri(uri, label) {
  const host = extractHost(uri);
  const dbName = process.env.MONGO_DB_NAME || extractDbName(uri) || "petcare";

  console.log(`\n=== ${label} ===`);
  if (host) {
    const dnsStart = performance.now();
    try {
      await dns.lookup(host);
      const dnsMs = performance.now() - dnsStart;
      console.log(`DNS lookup: ${dnsMs.toFixed(1)}ms (${host})`);
    } catch (err) {
      console.log(`DNS lookup failed: ${err.message}`);
    }

    const pingRes = await pingHost(host);
    if (pingRes.ok) {
      console.log(`Ping result:\n${pingRes.output.trim()}`);
    } else {
      console.log(`Ping failed: ${pingRes.error}`);
    }
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    serverSelectionTimeoutMS: 10000,
    compressors: ["zlib", "snappy"],
    retryWrites: true,
    retryReads: true
  });

  const connectStart = performance.now();
  await client.connect();
  const connectMs = performance.now() - connectStart;

  const db = client.db(dbName);
  const col = db.collection("listings");

  const readStart = performance.now();
  await col.find({}, { projection: { _id: 1 } }).limit(1).toArray();
  const readMs = performance.now() - readStart;

  const writeStart = performance.now();
  const insertRes = await col.insertOne(
    { _latencyProbe: true, createdAt: new Date() },
    { writeConcern: { w: 1 } }
  );
  const writeMs = performance.now() - writeStart;

  await col.deleteOne({ _id: insertRes.insertedId });
  await client.close();

  console.log(
    JSON.stringify(
      {
        connectMs: Number(connectMs.toFixed(1)),
        readMs: Number(readMs.toFixed(1)),
        writeMs: Number(writeMs.toFixed(1)),
        dbName
      },
      null,
      2
    )
  );
}

async function main() {
  const atlasUri = process.env.MONGO_URI;
  const localUri = process.env.MONGO_URI_LOCAL;

  if (!atlasUri && !localUri) {
    console.error("MONGO_URI or MONGO_URI_LOCAL must be set");
    process.exit(1);
  }

  if (localUri) {
    await testUri(localUri, "Local MongoDB");
  }

  if (atlasUri) {
    await testUri(atlasUri, "MongoDB Atlas");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
