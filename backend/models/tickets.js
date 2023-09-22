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
        let db;
        try {
            db = await database.getDb();
            const allTickets = await db.collection.find({}).toArray();

            return res.json({
                data: allTickets
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
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

        const doc = {
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        };

        const result = await db.collection.insertOne(doc);

        if (result.acknowledged === true) {
            return res.status(201).json({
                data: result
            });
        }

        let db;
        try {
            db = await database.getDb();

            const doc = {
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate
            };
    
            const result = await db.collection.insertOne(doc);
    
            // if (result.acknowledged === true) {
            return res.status(201).json({
                data: result
            });
            // }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }





        // Exempel 

        // let db;
        // try {
        //     db = await database.getDb();

        //     const filter = { email: email };
        //     const keyObject = await db.collection.findOne(filter);

        //     if (keyObject) {
        //         return res.json({ data: keyObject });
        //     }
        // } catch (e) {
        //     return res.status(500).json({
        //         errors: {
        //             status: 500,
        //             source: "/",
        //             title: "Database error",
        //             detail: e.message
        //         }
        //     });
        // } finally {
        //     await db.client.close();
        // }
    },
};

module.exports = tickets;
