const amqp = require('amqplib');
const { AMQPPubSub } = require('graphql-amqp-subscriptions');
const { v4: uuid } = require('uuid');

// mockRobot = {
//   id: '1',
//   name: uuid(),
//   position: { x: 0, y: 0 },
//   telemetry: {
//     battery: '0.75352',
//     lastActivity: '10.11.20 10:48:25',
//   },
// };
// mockRobots = [mockRobot];

mockRobot1 = {
  id: '1',
  name: uuid(),
  position: { x: 1.727336, y: -2.248892 },
  telemetry: {
    battery: '0.75352',
    lastActivity: '10.11.20 10:48:25',
  },
};
mockRobot2 = {
  id: '2',
  name: uuid(),
  position: { x: 3.727336, y: -2.248892 },
  telemetry: {
    battery: '0.75352',
    lastActivity: '10.11.20 10:48:25',
  },
};
mockRobot3 = {
  id: '3',
  name: uuid(),
  position: { x: 5.727336, y: -2.248892 },
  telemetry: {
    battery: '0.75352',
    lastActivity: '10.11.20 10:48:25',
  },
};
mockRobots = [mockRobot1, mockRobot2, mockRobot3];

class RobotDataModel {
  constructor(options = {}) {
    const { connection = 'amqp://localhost' } = options;

    this.url = connection;
    this.subscriptions = {};
  }

  async getRobot(id) {
    return mockRobots.find(({ id: stored }) => stored === id);
  }

  async getRobots() {
    return mockRobots;
  }

  async subcribePositions() {
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
        }).asyncIterator('coordinates');
      });
    }
    return this.subscriptions.positions;
  }
}

module.exports = RobotDataModel;
