const delayed = require('../models/delayed.js');
const DelayType = require("./delayed.js");
const codes = require('../models/codes.js');
const CodeType = require("./code.js");
const tickets = require('../models/tickets.js');
const TicketType = require('./ticket.js');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const {
    GraphQLObjectType,
    GraphQLList
} = require('graphql');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        // delay: {
        //     type: DelayType,
        //     description: 'A single delay',
        //     args: {
        //         activityId: { type: GraphQLString }
        //     },
        //     resolve: async function(_, args) {
        //         let delayArray = await delayed.getFromTrafikVerket();

        //         return delayArray.find(delay => delay.ActivityId === args.ActivityId);
        //     }
        // },
        delayed: {
            type: GraphQLList(DelayType),
            description: 'List of all delayed trains',
            resolve: async function() {
                return await delayed.getFromTrafikVerket();
            }
        },
        codes: {
            type: GraphQLList(CodeType),
            description: 'List of reason codes',
            resolve: async (post, args, context) => {
                const token = context.headers['x-access-token'];

                if (token) {
                    try {
                        jwt.verify(token, jwtSecret);
                        return await codes.getCodes();
                    } catch (err) {
                        throw new Error(`Failed authentication: ${err.message}`);
                    }
                } else {
                    throw new Error('Token not provided');
                }
            }
        },
        tickets: {
            type: GraphQLList(TicketType),
            description: 'List of tickets',

            resolve: async (post, args, context) => {
                const token = context.headers['x-access-token'];

                if (token) {
                    try {
                        jwt.verify(token, jwtSecret);
                        return await tickets.getTickets();
                    } catch (err) {
                        throw new Error(`Failed authentication: ${err.message}`);
                    }
                } else {
                    throw new Error('Token not provided');
                }
            }
        },
    })
});

module.exports = RootQueryType;
