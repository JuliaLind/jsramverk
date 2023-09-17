const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res) {
        const db = await database.getDb();
        const allTickets = await db.collection.find({}).toArray();

        await db.client.close();

        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req, res){
        const db = await database.getDb();

        const doc = {
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        };

        const result = await db.collection.insertOne(doc);

        return res.status(201).json({
            data: result
        });

        // if (result.ok) {
        //     console.log(result.ops);
        //     return res.status(201).json({ data: result.ops });
        // }
    },
};

module.exports = tickets;
