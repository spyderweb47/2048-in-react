// src/services/database.ts
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://tanujbaware:PE5R8oJz05JyR9RL@cluster0.1aavq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export const checkUsername = async (wallet: string): Promise<string | null> => {
  try {
    await client.connect();
    const database = client.db("your_db_name");
    const users = database.collection("users");

    const user = await users.findOne({ wallet });
    return user ? user.username : null;
  } finally {
    await client.close();
  }
};

export const saveUsername = async (wallet: string, username: string): Promise<void> => {
  try {
    await client.connect();
    const database = client.db("your_db_name");
    const users = database.collection("users");

    const result = await users.updateOne(
      { wallet },
      { $set: { username } },
      { upsert: true } // Create a new document if it doesn't exist
    );
  } finally {
    await client.close();
  }
};
