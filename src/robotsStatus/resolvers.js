const { withFilter } = require('apollo-server-express');

const resolvers = {
  Query: {
    getRobot: async (_, { id }, { models: { robotData } }) => {
      const getting = await robotData.getRobot(id);
      return { ...getting };
    },
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
