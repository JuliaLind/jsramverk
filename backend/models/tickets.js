/**
 * @module tickets
 * @description Tickets module containing functions for
 * getting tickets from database and
 * inserting created tickets to database.
 */

// Get database object
const database = require('../db/database.js');
const ObjectId = require('mongodb').ObjectId;

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
        try {
            const db = await database.getDb();
            // const allTickets = await db.collection.tickets.find({}).toArray();
            const allTickets = await db.collection.tickets.find({}).sort({_id:-1}).toArray();
            await db.client.close();
            return res.json({
                data: allTickets
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/tickets",
                    title: "Database error",
                    detail: e.message
                }
            });
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
    createTicket: async function createTicket(req, res) {
        try {
            const db = await database.getDb();
            const doc = {
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate
            };

            const result = await db.collection.tickets.insertOne(doc);

            await db.client.close();

            return res.status(201).json({
                data: result
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/tickets",
                    title: "Database error",
                    detail: e.message
                }
            });
        }
    },
    deleteTicket: async function deleteTicket(res, req) {
        try {
            const db = await database.getDb();
            const ticketId = req.body._id;
            const filter = { _id: new ObjectId(ticketId) };

            await db.collection.tickets.deleteOne(filter);

            await db.client.close();

            return res.status(201).json({
                data: {
                    message: `Ticket ${ticketId} has been deleted`
                }
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/tickets",
                    title: "Database error",
                    detail: e.message
                }
            });
        }
    },
    updateTicket: async function updateTicket(res, req) {
        const ticketId = req.body._id;
        const code = req.body.code;
        const trainnumber = req.body.trainnumber;
        const traindate = req.body.traindate;
        // if (!ticketId || !code || !trainnumber || !traindate) {
        //     return res.status(401).json({
        //         errors: {
        //             status: 401,
        //             source: "/tickets",
        //             title: "No empty fields allowed",
        //             detail: "No empty fields allowed"
        //         }
        //     });
        // }

        const doc = {
            $set: {
                code: code,
                trainnumber: trainnumber,
                traindate: traindate
            }
        };
        const filter = {
            _id: new ObjectId(ticketId)
        };

        try {
            const db = await database.getDb();

            await db.collection.tickets.updateOne(filter, doc);

            const updatedTicket = await db.collection.tickets.findOne(filter);

            await db.client.close();

            return res.status(201).json({
                data: {
                    message: `Ticket ${ticketId} has been updated`,
                    ticket: updatedTicket
                }
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/tickets",
                    title: "Database error",
                    detail: e.message
                }
            });
        }
    }
};

module.exports = tickets;
