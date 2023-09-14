/**
 * @module database
 * @description MongoDB module containing function for
 * getting database collection and client
 */

// MongoClient for connecting to database
const mongo = require("mongodb").MongoClient;

// Database details
let dbName = "trains";

if (process.env.NODE_ENV === 'test') {
    dbName = "test";
}

const collectionName = "tickets";

/**
 * @description Database management object for connecting to MongoDB.
 * @property {Function} getDb - Connects to the MongoDB database
 */
const database = {
    /**
     * @description Connect to the MongoDB database.
     * @async
     * @function
     * @returns {Promise<Object>} An object containing the collection and client references.
     */
    getDb: async function getDb () {
        // URL path variables for shorter connection string (dsn).
        const scheme = "mongodb+srv:";
        const user = process.env.ATLAS_USERNAME;
        const password = process.env.ATLAS_PASSWORD;
        const host = "testcluster.mnw8jji.mongodb.net";
        const query = "retryWrites=true&w=majority";

        const dsn = `${scheme}//${user}:${password}@${host}/${dbName}?${query}`;

        // let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@testcluster.mnw8jji.mongodb.net/${dbName}?retryWrites=true&w=majority`;

        // Connect to the MongoDB Atlas cluster.
        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Get a reference to the database and specified collection.
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
