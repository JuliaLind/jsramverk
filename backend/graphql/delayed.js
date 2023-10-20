const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
} = require('graphql');

const DelayType = new GraphQLObjectType({
    name: 'Delay',
    description: 'This represents a delayed train',
    fields: () => ({
        ActivityId: {type: GraphQLString},
        AdvertisedTimeAtLocation: {type: GraphQLString},
        EstimatedTimeAtLocation: {type: GraphQLString},
        OperationalTrainNumber: {type: GraphQLString},
        Canceled: {type: GraphQLBoolean},
        FromLocation: {type: GraphQLString},
        ToLocation: {type: GraphQLString},
        LocationSignature: {type: GraphQLString},
    })
});

module.exports = DelayType;
