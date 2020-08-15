const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');
const config = require('config');

const mapLayers = require('./mapLayers');
const robotsStatus = require('./robotsStatus');

const LayerDataModel = require('./dataSources/LayerDataModel');
const RobotDataModel = require('./dataSources/RobotDataModel');

const typeDef = gql`
  scalar JSON

  type Query
  type Mutation
  type Subscription
`;

const resolvers = {
  JSON: GraphQLJSON,
};

module.exports = {
  createApolloServer: async function (app, httpServer) {
    const layerModel = new LayerDataModel({ connection: config.amqp.connection });
    const robotModel = new RobotDataModel({ connection: config.amqp.connection });

    const server = await Promise.all([robotModel.subcribePositions()]).then(
      ([updateRobotPosition]) => {
        return new ApolloServer({
          typeDefs: [typeDef, mapLayers.typeDef, robotsStatus.typeDef],
          resolvers: [resolvers, mapLayers.resolvers, robotsStatus.resolvers],
          context: (connection) => {
            const context = {
              models: {
                layerData: layerModel,
                robotData: robotModel,
              },
              subscriptions: {
                updateRobotPosition: updateRobotPosition,
              },
            };
            if (connection) {
              return {
                ...connection.context,
                ...context,
              };
            }
            return context;
          },
        });
      },
    );

    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer);
  },
};
