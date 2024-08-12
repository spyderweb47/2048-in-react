import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.status(500).json({ error: 'MONGODB_URI is not defined' });
  }

  console.log("MONGODB_URI:", uri);  // Log the URI for debugging

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    res.status(200).json({ message: "Connected successfully to MongoDB" });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    res.status(500).json({ error: "Failed to connect to MongoDB", details: err.message });
  } finally {
    await client.close();
  }
}
