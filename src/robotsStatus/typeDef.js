const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getRobot(id: ID!): Robot
    getRobots: [Robot]!
  }

  extend type Subscription {
    updatedRobotPosition(id: ID!): Robot
  }

  type Robot {
    id: ID!
    name: String
    position: JSON
    telemetry: JSON
  }
`;

module.exports = {
  typeDef,
};
