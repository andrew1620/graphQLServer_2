const axios = require('axios');
const config = require('config');

const resolvers = {
  Query: {
    getMapConfig: async () => {
      const { data = null } = await axios.get(`${config.tms}/mapConfig`);

      return data && { ...data };
    },
  },
};

module.exports = {
  resolvers,
};
