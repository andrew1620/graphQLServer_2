const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    layers: [Layer]!
    layer(id: ID!): Layer
    me: User
  }

  type Layer {
    id: ID!
    name: String
    objects: Objects
    services: [Service]
  }
  type Service {
    service: String
    options: OptionType
  }

  type OptionType {
    draw: DrawType
    edit: EditType
  }

  type DrawType {
    polyline: PolylineType
    polygon: PolygonType
    rectangle: Boolean
    circle: Boolean
    marker: Boolean
    circlemarker: Boolean
  }
  type PolylineType {
    shapeOptions: JSON
    showLength: Boolean
  }
  type ShapeOptionsType {
    color: String
  }
  type PolygonType {
    shapeOptions: JSON
  }
  type EditType {
    edit: Boolean
  }

  type Objects {
    endpont: String
    types: [TypesItem]
  }
  type TypesItem {
    id: String
    format: JSON
  }

  type User {
    id: ID!
    userName: String!
    email: String!
    password: String!
    layers: [Layer]
  }

  type Mutation {
    saveLayer(layerId: ID!): LayerUpdateResponse!
    deleteLayer(layerId: ID!): LayerUpdateResponse!
    login(email: String): String # login token
    addLayer(layer: JSON): Layer
    changeLayer(layer: JSON): Layer
  }

  type LayerUpdateResponse {
    success: Boolean!
    message: String
    layers: [Layer]
  }

  type Subscription {
    layerAdded(repoFullName: String!): Layer
  }
`;

module.exports = typeDefs;
