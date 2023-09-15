const mongo = require("mongodb").MongoClient;
const collectionName = "tickets";
let dbName = "trains";

if (process.env.NODE_ENV === 'test') {
    dbName = "test";
}

const database = {
    getDb: async function getDb () {
        // let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@testcluster.mnw8jji.mongodb.net/${dbName}?retryWrites=true&w=majority`;
        let dsn = process.env.DSN + dbName;

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};



module.exports = database;
