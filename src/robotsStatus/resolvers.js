const { PubSub, withFilter } = require('apollo-server-express');

let pubsub = new PubSub();

const resolvers = {
  Query: {
    getRobots: async (_, __, { models: { robotData } }) => {
      const getting = await robotData.getRobots();
      return [...getting];
    },
  },
  Subscription: {
    updatedRobotPosition: {
      subscribe: withFilter(
        (_, __, { subscriptions: { robotPositionChanged } }) =>
          robotPositionChanged.asyncIterator('coordinates'),
        ({ id }, { id: subscribed }) => id === subscribed,
      ),
      resolve: async (payload, params, { models: { robotData } }) => {
        const { id, x, y } = payload;
        console.log(`Send position: ${x} ${y}`);
        return {
          id,
          position: {
            x: parseFloat(x),
            y: parseFloat(y),
          },
        };
      },
    },
  },
};

module.exports = {
  resolvers,
};
