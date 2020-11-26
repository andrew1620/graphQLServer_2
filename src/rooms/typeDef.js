const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getRoom(id: ID!): Room
    getRooms: [Room]!
  }

  type Room {
    id: ID!
    name: String!
    organization: Organization!
  }
`;

module.exports = {
  typeDef,
};
