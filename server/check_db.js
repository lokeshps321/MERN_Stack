import mongoose from 'mongoose';

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/petcare');
  
  console.log("=== USERS ===");
  const users = await mongoose.connection.collection('users').find({}, {projection: {_id: 1, email: 1, name: 1, role: 1, clerkUserId: 1}}).toArray();
  users.forEach(u => console.log(JSON.stringify(u)));
  
  console.log("\n=== REQUESTS ===");
  const requests = await mongoose.connection.collection('requests').find({}, {projection: {listingId: 1, buyerId: 1, sellerId: 1, status: 1, createdAt: 1}}).toArray();
  requests.forEach(r => console.log(JSON.stringify(r)));
  
  console.log("\n=== LISTINGS ===");
  const listings = await mongoose.connection.collection('listings').find({}, {projection: {title: 1, sellerId: 1, status: 1}}).toArray();
  listings.forEach(l => console.log(JSON.stringify(l)));
  
  await mongoose.disconnect();
}

check().catch(console.error);
