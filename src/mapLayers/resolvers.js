const { PubSub, withFilter } = require('apollo-server-express');
const pubsub = new PubSub();

LAYER_CHANGED = 'LAYER_CHANGED';

const resolvers = {
  Query: {
    getMapLayer: async (_, { id }, { models: { layerData } }) => {
      const getting = await layerData.getLayer(id);
      return { ...getting };
    },
    getMapLayers: async (_, __, { models: { layerData } }) => {
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
};

module.exports = {
  resolvers,
};
