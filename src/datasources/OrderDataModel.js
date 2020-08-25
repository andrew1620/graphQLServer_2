const amqp = require('amqplib');
const { AMQPPubSub } = require('graphql-amqp-subscriptions');

const DataModel = require('./DataModel');

mockOrder1 = {
  id: '1',
  number: 152,
  status: 3,
  robot_id: '1',
  time: '10:48:34',
};
mockOrder2 = {
  id: '2',
  number: 153,
  status: 1,
  robot_id: '2',
  time: '10:55:25',
};
mockOrder3 = {
  id: '3',
  number: 151,
  status: 2,
  robot_id: '3',
  time: '10:32:12',
};
mockOrders = [mockOrder1, mockOrder2, mockOrder3];

const queues = { GET_ORDERS: 'rpc_find_order_for_interface' };
const requestOrdersActions = { GET_ORDERS: 1, GET_ORDER: 2 };

class OrderDataModel extends DataModel {
  constructor(options = {}) {
    super(options);
  }

  async getOrder(id) {
    return mockOrders.find(({ id: stored }) => stored === id);

    // const data = await this.getData({
    //   queue: queues.GET_ORDERS,
    //   message: { key: requestOrdersActions.GET_ORDERS, order: id },
    // });

    // if (!data) throw Error('Not getting data');

    // const { order, status = null, robot_id = null } = data;
    // return {
    //   id: order,
    //   status,
    //   processed: robot_id,
    // };
  }

  async getOrders() {
    return mockOrders;

    // const data = await this.getData({
    //   queue: queues.GET_ORDERS,
    //   message: { key: requestOrdersActions.GET_ORDER },
    // });

    // if (!data) throw Error('Not getting data');

    // const { order, status = null, robot_id = null } = data;
    // return {
    //   id: order,
    //   status,
    //   processed: robot_id,
    // };
  }
}

module.exports = OrderDataModel;
