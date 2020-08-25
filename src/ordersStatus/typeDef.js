const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getOrder(id: ID!): Order
    getOrders: [Order]!
  }

  # extend type Subscription {
  #   updatedOrderStatus(id: ID!): Order
  # }

  type Order {
    id: ID!
    number: Int
    status: Int
    table: ID
    processed: ID
    time: String
  }
`;

module.exports = {
  typeDef,
};
