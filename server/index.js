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
  JSON: GraphQLJSON
};

const PORT = 3006;
const app = express();
const server = new ApolloServer({
  typeDefs: [typeDefs, typeDefJSON],
  resolvers: [resolvers, resolverJSON],
  dataSources: () => ({
    layerAPI: new LayerAPI()
  })
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `subscriptions ready at http://localhost:${PORT}${server.subscriptionsPath}`
  );
});

// const { ApolloServer } = require("apollo-server");
// const typeDefs = require("./schema");
// const { GraphQLJSON } = require("graphql-type-json");
// const resolvers = require("./resolvers");

// const LayerAPI = require("./datasources/layer");

// const { AmqpPubSub } = require("graphql-rabbitmq-subscriptions");
// const logger = require("./datasources/logger");
// const pubsub = new AmqpPubSub({
//   config: {
//     host: "RABBITMQ_DOMAIN_NAME",
//     port: "PORT_NUMBER"
//   },
//   logger
// });

// const typeDefJSON = `
// scalar JSON
// `;
// const resolverJSON = {
//   JSON: GraphQLJSON
// };

// const server = new ApolloServer({
//   typeDefs: [typeDefs, typeDefJSON],
//   resolvers: [resolvers, resolverJSON],
//   dataSources: () => ({
//     layerAPI: new LayerAPI()
//   })
// });

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });
