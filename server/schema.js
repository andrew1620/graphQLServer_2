const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    layers: [Layer]!
    layer(id: ID!): Layer
  }

  type Layer {
    id: ID
    name: String
    objects: Objects
    services: [Service]
    orderInfo: OrderInfo
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
    endpoint: String
    types: [TypesItem]
  }
  type TypesItem {
    id: String
    format: JSON
  }

  type OrderData {
    id: String
    orderNumber: String
    tableNumber: String
    orderDescription: String
  }
  type OrderInfo {
    id: String
    name: String
    batteryCharge: String
    lastActivity: String
    orderData: OrderData
  }

  type Mutation {
    changeLayer(layer: JSON): Layer
    deleteLayer(id: ID): Layer
    changeObjectBorders(objectData: JSON): Layer
    changeOrderInfo(info: JSON): Layer
  }

  type Subscription {
    layerChanged: Layer
  }
`;

module.exports = typeDefs;
