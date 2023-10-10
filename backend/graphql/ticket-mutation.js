const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull
} = require('graphql');

const TicketType = require('./ticket.js');
const ticketsModel = require('../models/tickets.js');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const RootMutationType = new GraphQLObjectType({
    name: 'TicketMutation',
    description: 'Root Mutation Tickets',
    fields: () => ({
        createTicket: {
            type: TicketType,
            description: 'Create a new ticket',
            args: {
                code: { type: GraphQLNonNull(GraphQLString) },
                trainnumber: { type: GraphQLNonNull(GraphQLString) },
                traindate: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (post, args, context) => {
                const token = context.headers['x-access-token'];

                console.log(token);
                if (token) {
                    try {
                        jwt.verify(token, jwtSecret);
                        return await ticketsModel.createTicket(args);
                    } catch (err) {
                        throw new Error(`Failed authentication: ${err.message}`);
                    }
                } else {
                    throw new Error('Token not provided');
                }
            }
        },
        deleteTicket: {
            type: TicketType,
            description: 'Delete a ticket',
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: async (post, args, context) => {
                const token = context.headers['x-access-token'];

                if (token) {
                    try {
                        jwt.verify(token, jwtSecret);
                        return await ticketsModel.deleteTicket(args);
                    } catch (err) {
                        throw new Error(`Failed authentication: ${err.message}`);
                    }
                } else {
                    throw new Error('Token not provided');
                }
            }
        },
        updateTicket: {
            type: TicketType,
            description: 'Update a ticket',
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                code: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (post, args, context) => {
                const token = context.headers['x-access-token'];

                if (token) {
                    try {
                        jwt.verify(token, jwtSecret);
                        return await ticketsModel.updateTicket(args);
                    } catch (err) {
                        throw new Error(`Failed authentication: ${err.message}`);
                    }
                } else {
                    throw new Error('Token not provided');
                }
            }
        },
    }),
});

module.exports = RootMutationType;
