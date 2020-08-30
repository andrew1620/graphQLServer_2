const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getRobots: [Robot]!
  }

  extend type Subscription {
    updatedRobotPosition(id: ID!): Robot
  }

  type Robot {
    id: ID!
    lastActivity: String
    name: String
    position: JSON
    telemetry: JSON
  }
`;

module.exports = {
  typeDef,
};
