const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

LAYER_CHANGED = "LAYER_CHANGED";

module.exports = {
  Query: {
    layers: (_, __, { dataSources }) => dataSources.layerAPI.getAllLayers(),
    layer: (_, { id }, { dataSources }) =>
      dataSources.layerAPI.getLayerById({ layerId: id })
  },
  Mutation: {
    changeLayer: (_, layer, { dataSources }) => {
      pubsub.publish(LAYER_CHANGED, { layerChanged: layer.layer });
      return dataSources.layerAPI.changeLayer(layer);
    }
  },
  Subscription: {
    layerChanged: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([LAYER_CHANGED])
    }
  }
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
