/**
 * @module tickets
 * @description Tickets module containing functions for
 * getting tickets from database and
 * inserting created tickets to database.
 */

// Get database object
const database = require('../db/database.js');

/**
 * @description Tickets object for getting
 * getting and creating tickets in database.
 *
 * @property {Function} getTickets - Gets all tickets from database.
 * @property {Function} createTicket - Inserts ticket into database.
 */
const tickets = {
    /**
     * @description Gets all tickets from database.
     * @async
     * @function
     * @param {Object} req - Express.js request object.
     * @param {Object} res - Express.js response object.
     * @returns {Promise<Object>} A JSON response containing tickets data.
     */
    getTickets: async function getTickets(req, res) {
        const db = await database.getDb();
        const allTickets = await db.collection.find({}).toArray();

        await db.client.close();

        return res.json({
            data: allTickets
        });
    },

    /**
     * @description Inserts ticket into database.
     * @async
     * @function
     * @param {Object} req - Express.js request object.
     * @param {Object} res - Express.js response object.
     * @returns {Promise<Object>} A JSON response containing info on inserted ticket.
     */
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
