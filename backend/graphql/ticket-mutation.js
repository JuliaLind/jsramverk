const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull
} = require('graphql');
const auth = require('../models/auth.js');
const TicketType = require('./ticket.js');
const ticketsModel = require('../models/tickets.js');

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
                auth.checkGQToken(context);
                return await ticketsModel.createTicket(args);
            }
        },
        deleteTicket: {
            type: TicketType,
            description: 'Delete a ticket',
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: async (post, args, context) => {
                auth.checkGQToken(context);
                return await ticketsModel.deleteTicket(args);
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
                auth.checkGQToken(context);
                return await ticketsModel.updateTicket(args);
            }
        },
    }),
});

module.exports = RootMutationType;
