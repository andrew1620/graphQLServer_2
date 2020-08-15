const amqp = require('amqplib');
const { v4: uuid } = require('uuid');

class DataModel {
  constructor(options = {}) {
    const { connection = 'amqp://localhost' } = options;

    this.url = connection;
  }

  async getData({ queue, message = '' }) {
    const connection = await amqp.connect(this.url);
    const channel = await connection.createChannel();
    const { queue: retryQueue } = await channel.assertQueue('', { exclusive: true });

    const request = function () {
      return new Promise((resolve, reject) => {
        const correlationId = uuid();

        channel.consume(
          retryQueue,
          (message) => {
            if (message.properties.correlationId == correlationId) {
              try {
                const result = JSON.parse(message.content.toString());
                resolve(result || null);
              } catch (error) {
                reject(error);
              }
            }
          },
          { noAck: true },
        );

        const packed = Buffer.from(JSON.stringify(message));
        channel.sendToQueue(queue, packed, { correlationId, replyTo: retryQueue });
      });
    };
    const response = await request();

    connection.close();
    return response;
  }

  async sendData({ queue, message = '' }) {
    const connection = await amqp.connect(this.url);
    const channel = await connection.createChannel();
    channel.assertQueue(queue, { durable: false });
    const packed = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queue, packed);
  }
}

module.exports = { DataModel };
