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

    // getTickets: async function getTickets(req, res){
    //     var db = await database.openDb();

    //     var allTickets = await db.all(`SELECT *, ROWID as id FROM tickets ORDER BY ROWID DESC`);

    //     await db.close();

    //     return res.json({
    //         data: allTickets
    //     });
    // },

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

    // createTicket: async function createTicket(req, res){
    //     var db = await database.openDb();

    //     const result = await db.run(
    //         'INSERT INTO tickets (code, trainnumber, traindate) VALUES (?, ?, ?)',
    //         req.body.code,
    //         req.body.trainnumber,
    //         req.body.traindate,
    //     );

    //     await db.close();

    //     return res.json({
    //         data: {
    //             id: result.lastID,
    //             code: req.body.code,
    //             trainnumber: req.body.trainnumber,
    //             traindate: req.body.traindate,
    //         }
    //     });
    // }
};

module.exports = tickets;
