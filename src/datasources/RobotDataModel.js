const amqp = require('amqplib');
const { AMQPPubSub } = require('graphql-amqp-subscriptions');

const DataModel = require('./DataModel');

mockRobot1 = {
  robot_id: '1',
  name: 'delivery-order-platform',
  is_active: true,
  position: { x: 1.727336, y: -2.248892 },
  telemetry: {
    battery: '0.75352',
    lastActivity: '10.11.20 10:48:25',
  },
};
mockRobot2 = {
  robot_id: '2',
  name: 'delivery-order-platform',
  is_active: true,
  position: { x: 3.727336, y: -2.248892 },
  telemetry: {
    battery: '0.75352',
    lastActivity: '10.11.20 10:48:25',
  },
};
mockRobot3 = {
  robot_id: '3',
  name: 'delivery-order-platform',
  is_active: true,
  position: { x: 5.727336, y: -2.248892 },
  telemetry: {
    battery: '0.75352',
    lastActivity: '10.11.20 10:48:25',
  },
};
mockRobots = [mockRobot1, mockRobot2, mockRobot3];

const queues = {
  GET_ROBOTS: 'rpc_robots_db',
};

class RobotDataModel extends DataModel {
  constructor(options = {}) {
    super(options);

    this.subscriptions = {};
  }

  parseRobotStatus({ robot_id, name = 'delivery-order-platform', lastActivity = null }) {
    return { id: robot_id, name, lastActivity };
  }

  async getRobot(id) {
    const robots = await this.getRobots();
    const data = robots.find((robot) => robot.id === id);

    if (!data) return null;

    const { position = null, ...robotStatus } = data;
    return { position, ...robotStatus };
  }

  async getRobots() {
    // const data = mockRobots;

    const data = await this.getData({ queue: queues.GET_ROBOTS });

    if (!data) throw Error('Not getting data from api request');

    const time = new Date();
    return data.map((robot) => {
      const { is_active, ...robotStatus } = robot;
      return this.parseRobotStatus({
        lastActivity: is_active ? time.toISOString() : null,
        ...robotStatus,
      });
    });
  }

  async subscribePositions() {
    if (!this.subscriptions.positions) {
      this.subscriptions.positions = await amqp.connect(this.url).then((conn) => {
        return new AMQPPubSub({
          connection: conn,
          queue: {
            name: 'coordinates',
            options: {
              autoDelete: false,
              durable: false,
            },
          },
        });
      });
    }
    return this.subscriptions.positions;
  }
}

module.exports = RobotDataModel;
