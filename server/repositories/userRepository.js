// or as an es module:
const { MongoClient } = require("mongodb");
let connection;
const client = new MongoClient(process.env.DATABASE_URL);
async function userCollection() {
  connection = await client.connect();
  const database = connection.db("EcoTrade");
  const collection = database.collection("users");
  return collection;
}

async function checkUser(email) {
  try {
    const collection = await userCollection();
    const user = await collection.findOne({ email: email });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function insertUser(name, email, password) {
  if (await checkUser(email)) {
    console.log("User already exists");
    return null;
  }
  try {
    const collection = await userCollection();
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
    return null;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = { insertUser, checkUser };
