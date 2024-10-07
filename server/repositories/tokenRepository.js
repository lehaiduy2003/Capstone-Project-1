// const { MongoClient, ObjectId } = require('mongodb')
// let connection
// const client = new MongoClient(process.env.DATABASE_URL);
// async function tokenCollection() {
//   connection = await client.connect();
//   const database = connection.db('EcoTrade');
//   const collection = database.collection('oauthTokens');
//   return collection;
// }

// // Connection URL

// async function insertToken(userId, accessToken, refreshToken) {
//   try {
//     const collection = await tokenCollection();
//     await collection.insertOne({ user_id: userId, accessToken: accessToken, refreshToken: refreshToken })
//     //const result = await collection.findOne({ user_id: userId })
//     //console.log(result);
//     return true
//   } catch (error) {
//     console.error(error)
//     return false
//   }
//   finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// }

// async function updateToken(userId, token) {
//   try {
//     //console.log(userId);

//     const collection = await tokenCollection();
//     const id = ObjectId.createFromHexString(userId);
//     //console.log(id);

//     //const oauth = await collection.findOne({ user_id: id })
//     //console.log(oauth);

//     const result = await collection.updateOne(
//       { user_id: id },
//       {
//         $set: { accessToken: token },
//       },

//     );
//     return result
//   } catch (error) {
//     console.error(error)
//     return null
//   }
//   finally {
//     if (connection) {
//       await connection.close();
//     }
//   }

// }

// // async function findToken(token) {
// //   try {
// //     const collection = await tokenCollection();
// //     const refToken = await collection.findOne({ refreshToken: token })

// //     return refToken.refreshToken
// //   } catch (error) {
// //     console.error(error)
// //     return null
// //   }
// //   finally {
// //     if (connection) {
// //       await connection.close();
// //     }
// //   }
// // }

// module.exports = { insertToken, updateToken }
