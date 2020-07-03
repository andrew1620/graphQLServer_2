const { PubSub, withFilter } = require('apollo-server');
const pubsub = new PubSub();

LAYER_CHANGED = 'LAYER_CHANGED';

module.exports = {
  Query: {
    layer: async (_, { id }, { models: { layerData } }) => {
      const getting = await layerData.getLayer(id);
      return { ...getting };
    },
    layers: async (_, __, { models: { layerData } }) => {
      const getting = await layerData.getLayers();
      return [...getting];
    },
  },
  Mutation: {
    createObject: async (_, { id, object }, { models: { layerData } }) => {
      console.log(`create object at layer ${id}`);
      await layerData.createObject(id, object);
      pubsub.publish(LAYER_CHANGED, { id });
      return true;
    },
    updateObjects: async (_, { id, objects }, { models: { layerData } }) => {
      console.log(`update objects at layer ${id}`);
      await layerData.updateObjects(id, objects);
      pubsub.publish(LAYER_CHANGED, { id });
      return true;
    },
    removeObjects: async (_, { id, objects }, { models: { layerData } }) => {
      console.log(`remove objects at layer ${id}`);
      await layerData.removeObjects(id, objects);
      pubsub.publish(LAYER_CHANGED, { id });
      return true;
    },

    // changeOrderInfo: async (_, data, { dataSources }) => {
    //   dataSources.layerAPI.changeOrderInfo(data.info);
    //   const updatedLayer = await dataSources.layerAPI.getAllLayers();
    //   console.log(updatedLayer);
    //   pubsub.publish(LAYER_CHANGED, { layerChanged: updatedLayer[0] });
    //   return updatedLayer[0];
    // },
  },
  Subscription: {
    layerChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([LAYER_CHANGED]),
        (payload, { id }) => {
          return payload.id === id;
        },
      ),
      resolve: async ({ id }, params, { models: { layerData } }) => {
        const getting = await layerData.getLayer(id);
        return { ...getting };
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
