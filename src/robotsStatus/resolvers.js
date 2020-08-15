const { PubSub, withFilter } = require('apollo-server-express');

let pubsub = new PubSub();

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
        (_, __, { subscriptions: { updateRobotPosition } }) => updateRobotPosition,
        // () => {
        //   mockUpdateRobotPosition();
        //   return pubsub.asyncIterator(['UPDATED_ROBOT_POSITION']);
        // },
        ({ id }, { id: subscribed }) => id === subscribed,
      ),
      resolve: async (payload, params, { models: { robotData } }) => {
        const { id, x, y } = payload;
        const getting = await robotData.getRobot(id);
        console.log(`Send position: ${x} ${y}`);
        return {
          ...getting,
          position: {
            x: parseFloat(x),
            y: parseFloat(y),
          },
        };
      },
    },
  },
};

function mockUpdateRobotPosition() {
  const id = '1';
  const position = { x: 0, y: 0 };
  const interval = setInterval(() => {
    position.x += 0.5;
    position.y -= 0.5;
    const message = { id, x: position.x, y: position.y };
    pubsub.publish('UPDATED_ROBOT_POSITION', message);
  }, 1000);
  setTimeout(() => {
    clearInterval(interval);
  }, 10000);
}

module.exports = {
  resolvers,
};
