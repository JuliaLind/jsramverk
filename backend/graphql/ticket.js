const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} = require('graphql');

const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    description: 'This represents a ticket',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        code: { type: GraphQLNonNull(GraphQLString) },
        trainnumber: { type: GraphQLNonNull(GraphQLString) },
        traindate: { type: GraphQLNonNull(GraphQLString) }
    })
});

module.exports = TicketType;
