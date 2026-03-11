import mongoose from "mongoose";

async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/petcare");
  const listings = mongoose.connection.collection("listings");
  
  const allListings = await listings.find({}).toArray();
  console.log(JSON.stringify(allListings, null, 2));
  
  process.exit(0);
}

run();
