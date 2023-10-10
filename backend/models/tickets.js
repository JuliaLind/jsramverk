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
    getTickets: async function getTickets() {
        try {
            const db = await database.getDb();
            const allTickets = await db.collection.tickets.find({}).sort({ _id: -1 }).toArray();

            await db.client.close();
            return allTickets;
        } catch (e) {
            throw new Error({
                errors: {
                    status: 500,
                    source: "/graphql",
                    title: "Database error",
                    detail: e.message
                }
            });
            // return res.status(500).json({
            //     errors: {
            //         status: 500,
            //         source: "/tickets",
            //         title: "Database error",
            //         detail: e.message
            //     }
            // });
        }
    },

    /**
     * @description Inserts ticket into database.
     * @async
     * @function
     * @param {Object} req - Express.js request object. // ÄNDRA
     * @param {Object} res - Express.js response object. // ÄNDRA
     * @returns {Promise<Object>} A JSON response containing info on inserted ticket.
     */
    createTicket: async function createTicket(args) {
        try {
            const db = await database.getDb();
            const doc = {
                code: args.code,
                trainnumber: args.trainnumber,
                traindate: args.traindate
            };

            const result = await db.collection.tickets.insertOne(doc);

            await db.client.close();

            return {
                _id: result.insertedId,
                code: args.code,
                trainnumber: args.trainnumber,
                traindate: args.traindate
            };

            // return res.status(201).json({
            //     data: result
            // });
        } catch (e) {
            // return res.status(500).json({
            //     errors: {
            //         status: 500,
            //         source: "/tickets",
            //         title: "Database error",
            //         detail: e.message
            //     }
            // });
            throw new Error({
                errors: {
                    status: 500,
                    source: "/graphql/tickets",
                    title: "Database error",
                    detail: e.message
                }
            });
        }
    },
    deleteTicket: async function deleteTicket(args) {
        try {
            const db = await database.getDb();
            const ticketId = args._id;
            const filter = { _id: new ObjectId(ticketId) };

            await db.collection.tickets.deleteOne(filter);

            await db.client.close();

            return {
                _id: ticketId
            };

            // return res.status(201).json({
            //     data: {
            //         message: `Ticket ${ticketId} has been deleted`
            //     }
            // });
        } catch (e) {
            // return res.status(500).json({
            //     errors: {
            //         status: 500,
            //         source: "/tickets",
            //         title: "Database error",
            //         detail: e.message
            //     }
            // });
            throw new Error({
                errors: {
                    status: 500,
                    source: "/graphql/tickets",
                    title: "Database error",
                    detail: e.message
                }
            });
        }
    },
    updateTicket: async function updateTicket(args) {
        const ticketId = args._id;
        const code = args.code;
        const doc = {
            $set: {
                code: code,
                updated: new Date().toJSON().slice(0, 10)
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

            return {
                _id: updatedTicket._id,
                code: updatedTicket.code,
                trainnumber: updatedTicket.trainnumber,
                traindate: updatedTicket.traindate
            };

            // return res.status(201).json({
            //     data: {
            //         message: `Ticket ${ticketId} has been updated`,
            //         ticket: updatedTicket
            //     }
            // });
        } catch (e) {
            throw new Error({
                errors: {
                    status: 500,
                    source: "/graphql/tickets",
                    title: "Database error",
                    detail: e.message
                }
            });
            // return res.status(500).json({
            //     errors: {
            //         status: 500,
            //         source: "/tickets",
            //         title: "Database error",
            //         detail: e.message
            //     }
            // });
        }
    }
};

module.exports = tickets;
