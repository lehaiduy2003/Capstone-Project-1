const { connectDb, closeConnection } = require("../configs/database");

async function checkUser(email) {
  try {
    const collection = await connectDb("users");
    const user = await collection.findOne({ email: email });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await closeConnection();
  }
}

async function insertUser(email, password) {
  if (await checkUser(email)) {
    console.log("User already exists");
    return null;
  }
  try {
    const collection = await connectDb("users");
    const user = await collection.insertOne({
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
    await closeConnection();
  }
}

module.exports = { insertUser, checkUser };
