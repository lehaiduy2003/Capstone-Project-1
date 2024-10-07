const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DATABASE_URL);
let conn;
async function connectDb(collectionName) {
  if (process.env.NODE_ENV === "test") {
    return {
      findOne: jest.fn(),
      insertOne: jest.fn(),
    };
  }
  conn = await client.connect();
  const database = conn.db("EcoTrade");
  const collection = database.collection(collectionName);
  return collection;
}

async function closeConnection() {
  if (conn) {
    await conn.close();
  }
}

module.exports = { connectDb, closeConnection };
