const axios = require('axios');
const config = require('config');

const resolvers = {
  Query: {
    getMapConfig: async () => {
      const { data = null } = await axios.get(`http://${config.tms}:15032/mapConfig`);

      return data && { ...data };
    },
  },
};

module.exports = {
  resolvers,
};
