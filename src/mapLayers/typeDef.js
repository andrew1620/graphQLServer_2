const { gql } = require('apollo-server-express');

const typeDef = gql`
  extend type Query {
    getMapLayer(id: ID!): MapLayer
    getMapLayers: [MapLayer]!
  }

  extend type Mutation {
    createObject(id: ID!, object: JSON!): Boolean
    updateObjects(id: ID!, objects: JSON!): Boolean
    removeObjects(id: ID!, objects: JSON!): Boolean
  }

  extend type Subscription {
    layerChanged(id: ID!): MapLayer
  }

  type MapLayer {
    id: ID!
    name: String
    objects: [Object]
  }

  type Object {
    id: ID!
    data: JSON
  }
`;

module.exports = {
  typeDef,
};
