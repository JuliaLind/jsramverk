const {
    GraphQLObjectType,
    GraphQLString,
    // GraphQLBoolean,
    // GraphQLInt,
    GraphQLFloat,
    GraphQLList
} = require('graphql');


const PositionType = new GraphQLObjectType({
    name: 'Position',
    description: 'This represents position of a train',
    fields: () => ({
        trainnumber: {type: GraphQLString},
        position: {type: GraphQLList(GraphQLFloat)},
    })
});

module.exports = PositionType;
