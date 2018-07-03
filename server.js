'use strict'

const hapi = require('hapi');
const mongoose = require('mongoose');
const Workspace = require('./models/Workspace');

const {
	graphqlHapi,
	graphiqlHapi
} = require('apollo-server-hapi');

const schema = require('./graphql/schema');

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = hapi.server({
	host: 'localhost',
	port: 4444
});
//Connect DataBase : MongoDB
mongoose.connect('mongodb://jib:1234@localhost:27017/graphql_dev');
// or  (without credential)
//mongoose.connect('mongodb://localhost:27017/graphql_dev');

mongoose.connection.once('open', () => {
	console.log('connected to database');
});

const init = async () => {
	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Emplyee API Documentation',
					version: Pack.version
				}
			}
		}
	]);

	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}
	});

	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema
			},
			route: {
				cors: true
			}
		}
	});
	server.route([{
			method: 'GET',
			path: '/api/v1/workspaceall',
			config: {
				description: 'Get all the workspaces',
				tags: ['api', 'v1', 'workspace']
			},
			handler: (req, reply) => {
				return Workspace.find();
			}
		},
		{
			method: 'POST',
			path: '/api/v1/workspaceall',
			config: {
				description: 'Add workspace',
				tags: ['api', 'v1', 'workspace']
			},
			handler: (req, reply) => {
				const {
					name,
					url,
					technique
				} = req.payload;

				const workspaceObject = new Workspace({
					name,
					url,
					technique
				});

				return workspaceObject.save();
			}
		}
	]);

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};


init();