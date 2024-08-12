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
  const { method } = req;

  try {
    const db = (await clientPromise).db('your_db_name');
    const users = db.collection('users');

    switch (method) {
      case 'POST':
        const { wallet, username, score } = req.body;
        if (!wallet || !username) {
          res.status(400).json({ error: 'Missing wallet or username' });
          return;
        }

        if (score !== undefined) {
          const user = await users.findOne({ wallet });
          if (user) {
            if (!user.highScore || score > user.highScore) {
              await users.updateOne(
                { wallet },
                { $set: { highScore: score } }
              );
            }
          }
        } else {
          await users.updateOne(
            { wallet },
            { $set: { username } },
            { upsert: true }
          );
        }

        res.status(200).json({ success: true });
        break;
      case 'GET':
        const { wallet: walletQuery } = req.query;
        if (!walletQuery) {
          res.status(400).json({ error: 'Missing wallet query parameter' });
          return;
        }

        const user = await users.findOne({ wallet: walletQuery });
        res.status(200).json(user ? { username: user.username, highScore: user.highScore } : { username: null, highScore: null });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
