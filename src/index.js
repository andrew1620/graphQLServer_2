const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { GraphQLJSON } = require('graphql-type-json');

const config = require('config');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const LayerDataModel = require('./datasources/LayerDataModel');

const typeDefJSON = `
  scalar JSON
`;
const resolverJSON = {
  JSON: GraphQLJSON,
};

const PORT = process.env.PORT || config.port || 8000;
const app = express();
const server = new ApolloServer({
  typeDefs: [typeDefs, typeDefJSON],
  context: (connection) => {
    const context = {
      models: {
        layerData: new LayerDataModel({
          connection: config.amqp.connection,
        }),
      },
    };
    if (connection) {
      return {
        ...connection.context,
        ...context,
      };
    }
    return context;
  },
  resolvers: [resolvers, resolverJSON],
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`server ready at port ${PORT}`);
  console.log(`subscriptions ready at port ${PORT}`);
});
