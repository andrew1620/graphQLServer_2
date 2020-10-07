const { withFilter } = require('apollo-server-express');

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
      return true;
    },
    updateObjects: async (_, { id, objects }, { models: { layerData } }) => {
      console.log(`update objects at layer ${id}`);
      await layerData.updateObjects(id, objects);
      return true;
    },
    removeObjects: async (_, { id, objects }, { models: { layerData } }) => {
      console.log(`remove objects at layer ${id}`);
      await layerData.removeObjects(id, objects);
      return true;
    },
  },
  Subscription: {
    layerChanged: {
      subscribe: withFilter(
        (_, __, { subscriptions: { layerDataUpdated } }) =>
          layerDataUpdated.asyncIterator('updated_geodata_layer'),
        (payload, { id: subscribed }) => {
          return payload.id === subscribed;
        },
      ),
      resolve: async (payload, params, { models: { layerData } }) => {
        try {
          const getting = await layerData.getLayer(payload.id);

          return { ...getting };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    },
  },
};

module.exports = {
  resolvers,
};
