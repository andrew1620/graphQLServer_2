const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');
const config = require('config');

const mapLayers = require('./mapLayers');
const robotsStatus = require('./robotsStatus');
const ordersStatus = require('./ordersStatus');

const LayerDataModel = require('./dataSources/LayerDataModel');
const RobotDataModel = require('./dataSources/RobotDataModel');
const OrderDataModel = require('./dataSources/OrderDataModel');

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
    const orderModel = new OrderDataModel({ connection: config.amqp.connection });

    // const robotModel = new RobotDataModel({ connection: 'amqp://admin:admin@192.168.0.17' });
    // const orderModel = new OrderDataModel({ connection: 'amqp://admin:admin@192.168.0.17' });

    const server = await Promise.all([robotModel.subcribePositions()]).then(
      ([updateRobotPosition]) => {
        return new ApolloServer({
          typeDefs: [typeDef, mapLayers.typeDef, robotsStatus.typeDef, ordersStatus.typeDef],
          resolvers: [
            resolvers,
            mapLayers.resolvers,
            robotsStatus.resolvers,
            ordersStatus.resolvers,
          ],
          context: (connection) => {
            const context = {
              models: {
                layerData: layerModel,
                robotData: robotModel,
                orderData: orderModel,
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
