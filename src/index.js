const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const LayerAPI = require("./datasources/layer");
const { GraphQLJSON } = require("graphql-type-json");

const typeDefJSON = `
scalar JSON
`;
const resolverJSON = {
  JSON: GraphQLJSON,
};

const PORT = process.env.PORT || 3000;
const app = express();
const server = new ApolloServer({
  typeDefs: [typeDefs, typeDefJSON],
  resolvers: [resolvers, resolverJSON],
  dataSources: () => ({
    layerAPI: new LayerAPI(),
  }),
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `server ready at http://localhost:${PORT}${
      server.graphqlPath
    } ${new Date().toLocaleTimeString()} `
  );
  console.log(
    `subscriptions ready at http://localhost:${PORT}${server.subscriptionsPath}`
  );
});
