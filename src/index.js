const http = require('http');
const express = require('express');
const config = require('config');

const { createApolloServer } = require('./apollo');

const PORT = process.env.PORT || config.port || 8000;
const app = express();

const httpServer = http.createServer(app);

createApolloServer(app, httpServer);

httpServer.listen(PORT, () => {
  console.log(`server ready at port ${PORT}`);
  console.log(`subscriptions ready at port ${PORT}\n`);
});
