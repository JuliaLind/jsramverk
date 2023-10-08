const {
    GraphQLObjectType,
    GraphQLString
} = require('graphql')

const CodeType = new GraphQLObjectType({
    name: 'Code',
    description: 'This represents a code',
    fields: () => ({
        Code : { type: GraphQLString },
        Level1description: { type: GraphQLString },
        Level2description: { type: GraphQLString },
        Level3description: { type: GraphQLString },
    })
})

module.exports = CodeType;