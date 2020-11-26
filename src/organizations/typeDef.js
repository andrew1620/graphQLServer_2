const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getOrganization(id: ID!): Organization
    getOrganizations: [Organization]!
  }

  type Organization {
    id: ID!
    name: String!
    operators: [Operator]!
    rooms: [Room]!
  }
`;

module.exports = {
  typeDef,
};
