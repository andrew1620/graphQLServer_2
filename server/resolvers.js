const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

LAYER_CHANGED = "LAYER_CHANGED";

module.exports = {
  Query: {
    layers: (_, __, { dataSources }) => dataSources.layerAPI.getAllLayers(),
    layer: (_, { id }, { dataSources }) => dataSources.layerAPI.getLayerById({ layerId: id }),
  },
  Mutation: {
    async changeLayer(_, data, { dataSources }) {
      dataSources.layerAPI.changeLayer(data.layer);
      const updatedLayer = await dataSources.layerAPI.getAllLayers();

      pubsub.publish(LAYER_CHANGED, { layerChanged: updatedLayer[0] });

      return updatedLayer[0];

      //спросить нужно ли возвращать рез-т функции
      // return dataSources.layerAPI.changeLayer(data.layer);
    },
  },
  Subscription: {
    layerChanged: {
      subscribe: () => {
        return pubsub.asyncIterator(LAYER_CHANGED);
      },
    },
  },
  // Subscription: {
  //   layerAdded: {
  //     resolve: payload => {
  //       return {
  //         customData: payload
  //       };
  //     },
  //     subscribe: () => pubsub.asyncIterator("layerAdded")
  //   }
  // }
};
