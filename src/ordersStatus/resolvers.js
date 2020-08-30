const { withFilter } = require('apollo-server-express');

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
  Subscription: {
    orderStatusChanged: {
      subscribe: withFilter(
        (_, __, { subscriptions: { orderStatusChanged } }) =>
          orderStatusChanged.asyncIterator('orders'),
        (payload, { id: subscribed }) => {
          return typeof payload === 'object' && payload.order === subscribed;
        },
      ),
      resolve: async (payload, _, { models: { orderData } }) => {
        try {
          const orderStatus = orderData.parseOrderStatus(payload);

          return orderStatus;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    },
    ordersStatusListChanged: {
      subscribe: (_, __, { subscriptions: { ordersStatusListChanged } }) =>
        ordersStatusListChanged.asyncIterator(['add_order_interface']),
      resolve: async (payload, params, { models: { orderData } }) => {
        try {
          const getting = await orderData.getOrders();

          return [...getting];
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
