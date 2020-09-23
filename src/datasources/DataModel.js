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

        const waitingResponse = setTimeout(
          () => reject(new Error(`No answer for request ${queue}`)),
          5000,
        );

        channel.consume(
          retryQueue,
          (answer) => {
            if (answer.properties.correlationId == correlationId) {
              const result = JSON.parse(answer.content.toString());

              if (waitingResponse) clearTimeout(waitingResponse);

              resolve(result || null);
            }
          },
          { noAck: true },
        );

        const packed = Buffer.from(JSON.stringify(message));
        channel.sendToQueue(queue, packed, { correlationId, replyTo: retryQueue });
      });
    };

    try {
      const response = await request();
      return response;
    } catch (error) {
      console.log(error.message);
      throw error;
    } finally {
      connection.close();
    }
  }

  async sendData({ queue, message = '' }) {
    const connection = await amqp.connect(this.url);
    const channel = await connection.createChannel();
    channel.assertQueue(queue, { durable: false });
    const packed = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queue, packed);
  }
}

module.exports = DataModel;
