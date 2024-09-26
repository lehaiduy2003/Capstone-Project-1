// or as an es module:
const { MongoClient } = require("mongodb");

// Connection URL
const client = new MongoClient(process.env.DATABASE_URL);

async function checkUser(email) {
  try {
    const connection = await client.connect();
    const database = connection.db("EcoTrade");
    const collection = database.collection("users");
    const user = await collection.findOne({ email: email });
    return user;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function createUser(name, email, password) {
  if (await checkUser(email)) {
    console.log("User already exists");
    return null;
  }
  try {
    const connection = await client.connect();
    const database = connection.db("EcoTrade");
    const collection = database.collection("users");
    const user = await collection.insertOne({
      name: name,
      email: email,
      password: password,
    });
    if (user) {
      const userInfo = await collection.findOne({ email: email });
      return userInfo;
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

module.exports = { createUser, checkUser };
