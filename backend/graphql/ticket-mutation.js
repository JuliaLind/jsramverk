const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull
} = require('graphql');

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
            resolve: async function(_, args) {
                const data = await ticketsModel.createTicket(_, args);

                return data;
            },
        },
        deleteTicket: {
            type: TicketType,
            description: 'Delete a ticket',
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: async function(_, args) {
                const data = await ticketsModel.deleteTicket(_, args);

                return data;
            },
        },
        updateTicket: {
            type: TicketType,
            description: 'Update a ticket',
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                code: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async function(_, args) {
                const data = await ticketsModel.updateTicket(_, args);

                return data;
            },
        },
    }),
});

module.exports = RootMutationType;
