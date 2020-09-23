const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getMapConfig: MapConfig
  }

  type MapConfig {
    width: Int!
    height: Int!
    scale: Float!
  }
`;

module.exports = {
  typeDef,
};
