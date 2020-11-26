const resolvers = {
  Query: {
    getOperator: async (_, { id }, { models: { operatorData } }) => {
      const getting = await operatorData.getOperator(id);

      if (getting.status === 'failed') {
        return null;
      }

      return { ...getting.result };
    },
    getOperators: async (_, __, { models: { operatorData } }) => {
      const getting = await operatorData.getOperators();

      if (getting.status === 'failed') {
        return [];
      }

      return [...getting.result];
    },
  },
};

module.exports = {
  resolvers,
};
