import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

clientPromise = client.connect();

export default async function handler(req, res) {
  try {
    const db = (await clientPromise).db('your_db_name');
    const users = db.collection('users');

    // Fetch top players sorted by score
    const leaderboard = await users.find().sort({ highScore: -1 }).limit(10).toArray();

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
}
