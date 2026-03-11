import mongoose from 'mongoose';

async function fix() {
  await mongoose.connect('mongodb://127.0.0.1:27017/petcare');
  
  // Update user with email 1jt23ai029@jyothyit.ac.in
  const result = await mongoose.connection.collection('users').updateOne(
    { email: "1jt23ai029@jyothyit.ac.in" },
    { $set: { name: "heisenerg" } }
  );
  
  console.log("Updated:", result.modifiedCount, "user(s)");
  
  const user = await mongoose.connection.collection('users').findOne(
    { email: "1jt23ai029@jyothyit.ac.in" }
  );
  console.log("User now:", JSON.stringify(user));
  
  await mongoose.disconnect();
}

fix().catch(console.error);
