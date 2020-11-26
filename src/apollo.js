const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');
const config = require('config');

const mapLayers = require('./mapLayers');
const robotsStatus = require('./robotsStatus');
const ordersStatus = require('./ordersStatus');
const mapConfig = require('./mapConfig');
const operators = require('./operators');
const organizations = require('./organizations');
const rooms = require('./rooms');

const LayerDataModel = require('./dataSources/LayerDataModel');
const RobotDataModel = require('./dataSources/RobotDataModel');
const OrderDataModel = require('./dataSources/OrderDataModel');
const OperatorDataModel = require('./dataSources/OperatorDataModel');
const OrganizationDataModel = require('./dataSources/OrganizationDataModel');
const RoomDataModel = require('./dataSources/RoomDataModel');

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
    const operatorModel = new OperatorDataModel({ connection: config.amqp.connection });
    const organizationModel = new OrganizationDataModel({ connection: config.amqp.connection });
    const roomModel = new RoomDataModel({ connection: config.amqp.connection });

    const server = await Promise.all([
      layerModel.subscribeUpdateLayerData(),
      robotModel.subscribePositions(),
      orderModel.subscribeUpdateOrderStatus(),
      orderModel.subscribeUpdateOrdersStatusList(),
    ]).then(
      ([layerDataUpdated, robotPositionChanged, orderStatusChanged, ordersStatusListChanged]) => {
        return new ApolloServer({
          typeDefs: [
            typeDef,
            mapLayers.typeDef,
            robotsStatus.typeDef,
            ordersStatus.typeDef,
            mapConfig.typeDef,
            operators.typeDef,
            organizations.typeDef,
            rooms.typeDef,
          ],
          resolvers: [
            resolvers,
            mapLayers.resolvers,
            robotsStatus.resolvers,
            ordersStatus.resolvers,
            mapConfig.resolvers,
            operators.resolvers,
            organizations.resolvers,
            rooms.resolvers,
          ],
          context: (connection) => {
            const context = {
              models: {
                layerData: layerModel,
                robotData: robotModel,
                orderData: orderModel,
                operatorData: operatorModel,
                organizationData: organizationModel,
                roomData: roomModel,
              },
              subscriptions: {
                layerDataUpdated,
                robotPositionChanged,
                orderStatusChanged,
                ordersStatusListChanged,
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
