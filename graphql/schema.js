const graphql = require('graphql');
const WorkspaceType = require('./WorkspaceType');
const Workspace = require('../models/Workspace');

// ########### Create Type for graphSQL #############
// GraphQLList
// GraphQLObjectType
// GraphQLSchema
// GraphQLInt

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLList
} = graphql;

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType', //<-- Name for root query
	fields: () => ({
		workspaceAll: {
			type: new GraphQLList(WorkspaceType),
			resolve(parent, args) {
				return Workspace.find()
			}
		},
		workspaceById: {
			type: WorkspaceType,
			args: {
				id: {
					type: GraphQLString
				}
			},
			resolve(parent, args) {
				return Workspace.findById(args.id)
			}
		},
	})
});

// query <--- any name
module.exports = new GraphQLSchema({
	query: RootQuery
});