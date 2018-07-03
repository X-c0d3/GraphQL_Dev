const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const WorkspaceType = new GraphQLObjectType({
    name: 'Workspace',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        technique: { type: GraphQLString }
    })
});

module.exports = WorkspaceType;