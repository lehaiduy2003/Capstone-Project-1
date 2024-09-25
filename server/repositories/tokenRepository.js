
const { MongoClient } = require('mongodb')

// Connection URL
const client = new MongoClient(process.env.DATABASE_URL);

async function saveTokens(userId, accessToken, refreshToken) {
  try {
    const connection = await client.connect();
    const database = connection.db('EcoTrade');
    const collection = database.collection('oauthTokens');
    await collection.findOneAndUpdate({ userId: userId }, { $set: { accessToken: accessToken, refreshToken: refreshToken } })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
  finally {
    await client.close()
  }
}

async function findToken(token) {
  try {
    const connection = await client.connect();
    const database = connection.db('EcoTrade');
    const collection = database.collection('oauthTokens');
    const refToken = await collection.findOne({ refreshToken: token })
    console.log('refreshAccessToken:', refToken.refreshToken);

    return refToken.refreshToken
  } catch (error) {
    console.error(error)
    return null
  }
  finally {
    await client.close()
  }
}

module.exports = { saveTokens, findToken }