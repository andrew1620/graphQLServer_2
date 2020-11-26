const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getOperator(id: ID!): Operator
    getOperators: [Operator]!
  }

  type Operator {
    id: ID!
    familyName: String!
    givenName: String!
    email: String!
    organization: Organization!
    accessRooms: [Room]!
  }
`;

module.exports = {
  typeDef,
};
