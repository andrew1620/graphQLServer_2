const resolvers = {
  Query: {
    getRoom: async (_, { id }, { models: { roomData } }) => {
      const getting = await roomData.getRoom(id);

      if (getting.status === 'failed') {
        return null;
      }

      return { ...getting.result };
    },
    getRooms: async (_, __, { models: { roomData } }) => {
      const getting = await roomData.getRooms();

      if (getting.status === 'failed') {
        return null;
      }

      return [...getting.result];
    },
  },
};

module.exports = {
  resolvers,
};
