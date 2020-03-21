const { AmqpPubSub } = require("graphql-rabbitmq-subscriptions");
const logger = require("./datasources/logger");
const pubsub = new AmqpPubSub({
  config: {
    host: "RABBITMQ_DOMAIN_NAME",
    port: "PORT_NUMBER"
  },
  logger
});

module.exports = {
  Query: {
    layers: (_, __, { dataSources }) => dataSources.layerAPI.getAllLayers(),
    layer: (_, { id }, { dataSources }) =>
      dataSources.layerAPI.getLayerById({ layerId: id })
    //me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    addLayer: (_, { layer }, { datasources }) => {
      // dataSources.layerAPI.addLayer(data);
      pubsub.publish("addLayer", {
        payload: layer
      });
    },
    changeLayer: (_, data, { dataSources }) =>
      dataSources.layerAPI.changeLayer(data)
  },
  Subscription: {
    layerAdded: {
      resolve: payload => {
        return {
          customData: payload
        };
      },
      subscribe: () => pubsub.asyncIterator("layerAdded")
    }
  }
};
