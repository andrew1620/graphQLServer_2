const { PubSub } = require('apollo-server-express');

const resolvers = {
  Query: {
    getOrder: async (_, { id }, { models: { orderData } }) => {
      const getting = await orderData.getOrder(id);
      return { ...getting };
    },
    getOrders: async (_, __, { models: { orderData } }) => {
      const getting = await orderData.getOrders();
      return [...getting];
    },
  },
};

module.exports = {
  resolvers,
};
