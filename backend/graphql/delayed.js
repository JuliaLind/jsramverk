const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList
} = require('graphql');

// const LocationType = new GraphQLObjectType({
//     name: 'Location',
//     description: 'This represents a location',
//     fields: () => ({
//         LocationName: { type: GraphQLString},
//         Priority: { type: GraphQLInt },
//         Order: { type: GraphQLInt }
//     })
// });

const DelayType = new GraphQLObjectType({
    name: 'Delay',
    description: 'This represents a delayed train',
    fields: () => ({
        ActivityId: {type: GraphQLString},
        // ActivityType: {type: GraphQLString},
        AdvertisedTimeAtLocation: {type: GraphQLString},
        EstimatedTimeAtLocation: {type: GraphQLString},
        // AdvertisedTrainIdent: {type: GraphQLString},
        OperationalTrainNumber: {type: GraphQLString},
        Canceled: {type: GraphQLBoolean},
        // FromLocation: {type: GraphQLList(LocationType)},
        // ToLocation: {type: GraphQLList(LocationType)},
        FromLocation: {type: GraphQLString},
        ToLocation: {type: GraphQLString},
        LocationSignature: {type: GraphQLString},
        // TimeAtLocation: {type: GraphQLString},
        // TrainOwner: {type: GraphQLString}
    })
});

module.exports = DelayType;
