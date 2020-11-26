const amqp = require('amqplib');
const { AMQPPubSub } = require('graphql-amqp-subscriptions');

const DataModel = require('./DataModel');

mockOrders = [
  {
    order: '1',
    status: 5,
    robot_id: '1',
    time: '10:48:34',
  },
  {
    order: '2',
    status: 5,
    robot_id: '2',
    time: '10:55:25',
  },
  {
    order: '3',
    status: 5,
    robot_id: '3',
    time: '10:32:12',
  },
  {
    order: '4',
    status: 5,
    robot_id: '3',
    time: '10:30:02',
  },
  {
    order: '5',
    status: 5,
    robot_id: '3',
    time: '10:25:55',
  },
  {
    order: '6',
    status: 5,
    robot_id: '3',
    time: '10:23:41',
  },
  {
    order: '7',
    status: 5,
    robot_id: '3',
    time: '10:15:08',
  },
];

const queues = { GET_ORDERS: 'rpc_find_order_for_interface' };
const requestOrdersActions = { GET_ORDER: 1, GET_ORDERS: 2 };

class OrderDataModel extends DataModel {
  constructor(options = {}) {
    super(options);

    this.subscriptions = {};
  }

  parseOrderStatus({ order, status = null, robot_id = null, time }) {
    return {
      id: order,
      status: status && parseInt(status),
      processed: robot_id,
      time,
    };
  }

  async getOrder(id) {
    const data = [mockOrders.find(({ order: stored }) => stored === id)];

    // const data = await this.getData({
    //   queue: queues.GET_ORDERS,
    //   message: { key: requestOrdersActions.GET_ORDERS, order: id },
    // });

    if (!data[0]) throw Error('Not getting data from api request');

    return this.parseOrderStatus(data[0]);
  }

  async getOrders() {
    const data = mockOrders;

    // const data = await this.getData({
    //   queue: queues.GET_ORDERS,
    //   message: { key: requestOrdersActions.GET_ORDER },
    // });

    if (!data) throw Error('Not getting data from api request');

    return data.map((order) => this.parseOrderStatus(order));
  }

  async subscribeUpdateOrderStatus() {
    if (!this.subscriptions.order) {
      this.subscriptions.order = await amqp.connect(this.url).then((conn) => {
        return new AMQPPubSub({
          connection: conn,
          queue: {
            name: 'orders',
            options: {
              autoDelete: false,
              durable: true,
            },
          },
        });
      });
    }
    return this.subscriptions.order;
  }

  async subscribeUpdateOrdersStatusList() {
    if (!this.subscriptions.orders) {
      this.subscriptions.orders = await amqp.connect(this.url).then((conn) => {
        return new AMQPPubSub({
          connection: conn,
          queue: {
            name: 'add_order_interface',
            options: {
              autoDelete: false,
              durable: false,
            },
          },
        });
      });
    }
    return this.subscriptions.orders;
  }
}

module.exports = OrderDataModel;
