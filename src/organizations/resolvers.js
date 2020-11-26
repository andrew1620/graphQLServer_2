const resolvers = {
  Query: {
    getOrganization: async (_, { id }, { models: { organizationData } }) => {
      const getting = await organizationData.getOrganization(id);

      if (getting.status === 'failed') {
        return null;
      }

      return { ...getting.result };
    },
    getOrganizations: async (_, __, { models: { organizationData } }) => {
      const getting = await organizationData.getOrganizations();

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
