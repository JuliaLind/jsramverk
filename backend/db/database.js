const mongo = require("mongodb").MongoClient;
const collectionName = "tickets";
let dbName = "trains";

if (process.env.NODE_ENV === 'test') {
    dbName = "test";
}

const database = {
    getDb: async function getDb () {
        let dsn = process.env.DSN + dbName;

        const client  = await mongo.connect(dsn, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db:db,
            collection: collection,
            client: client,
        };
    }
};



module.exports = database;
