const delayed = require('../models/delayed.js');
const auth = require('../models/auth.js');
const trains = require('../models/trains.js');
const DelayType = require("./delayed.js");
const codes = require('../models/codes.js');
const CodeType = require("./code.js");
const tickets = require('../models/tickets.js');
const TicketType = require('./ticket.js');
const PositionType = require("./positions.js");
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
        positions: {
            type: GraphQLList(PositionType),
            description: 'List of all train-positions',
            resolve: async function() {
                return await trains.getFromTrafikverket();
            }
        },
        delayed: {
            type: GraphQLList(DelayType),
            description: 'List of all delayed trains',
            resolve: async function() {
                return await delayed.getFromTrafikverket();
            }
        },
        codes: {
            type: GraphQLList(CodeType),
            description: 'List of reason codes',
            resolve: async () => {
                return await codes.getFromTrafikverket();
            }
        },
        tickets: {
            type: GraphQLList(TicketType),
            description: 'List of tickets',

            resolve: async (post, args, context) => {
                auth.checkGQToken(context);
                return await tickets.getTickets();
            }
        },
    })
});



module.exports = RootQueryType;
