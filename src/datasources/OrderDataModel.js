const amqp = require('amqplib');
const { AMQPPubSub } = require('graphql-amqp-subscriptions');

const DataModel = require('./DataModel');

mockOrder1 = {
  id: '1',
  number: 152,
  processed: null,
  time: '10:48:34',
};
mockOrder2 = {
  id: '2',
  number: 153,
  processed: '2',
  time: '10:55:25',
};
mockOrder3 = {
  id: '3',
  number: 151,
  processed: '1',
  time: '10:32:12',
};
mockOrders = [mockOrder1, mockOrder2, mockOrder3];

class OrderDataModel extends DataModel {
  constructor(options = {}) {
    super(options);
  }

  getOrder(id) {
    return mockOrders.find(({ id: stored }) => stored === id);
  }

  getOrders() {
    return mockOrders;
  }
}

module.exports = OrderDataModel;
