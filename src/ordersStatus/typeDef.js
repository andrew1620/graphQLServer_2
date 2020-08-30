const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getOrder(id: ID!): Order
    getOrders: [Order]!
  }

  extend type Subscription {
    orderStatusChanged(id: ID!): Order
    ordersStatusListChanged: [Order]!
  }

  type Order {
    id: ID!
    status: Int
    table: ID
    processed: ID
    time: String
  }
`;

module.exports = {
  typeDef,
};
