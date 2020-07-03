const amqp = require('amqplib');
const { v4: uuid } = require('uuid');

const queues = {
  GET_LAYER: 'get_geodata_layer',
  GET_LAYERS: 'get_geodata_layers',
  CREATE_OBJECT: 'create_geodata_object',
  UPDATE_OBJECTS: 'update_geodata_objects',
  REMOVE_OBJECTS: 'remove_geodata_objects',
};

class LayerDataModel {
  constructor(options = {}) {
    const { connection = 'amqp://localhost' } = options;

    this.connection = amqp.connect(connection);
  }

  async getLayer(id) {
    return await this.getData({
      queue: queues.GET_LAYER,
      message: { id },
    });
  }

  async getLayers() {
    return await this.getData({ queue: queues.GET_LAYERS });
  }

  async createObject(id, object) {
    return await this.sendData({
      queue: queues.CREATE_OBJECT,
      message: {
        layerId: id,
        created: object,
      },
    });
  }

  async updateObjects(id, objects) {
    return await this.sendData({
      queue: queues.UPDATE_OBJECTS,
      message: {
        layerId: id,
        updated: objects,
      },
    });
  }

  async removeObjects(id, objects) {
    return await this.sendData({
      queue: queues.REMOVE_OBJECTS,
      message: {
        layerId: id,
        removed: objects,
      },
    });
  }

  async getData({ queue, message = '' }) {
    const connection = await this.connection;
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

    return response;
  }

  async sendData({ queue, message = '' }) {
    const connection = await this.connection;
    const channel = await connection.createChannel();
    channel.assertQueue(queue, { durable: false });
    const packed = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queue, packed);
  }
}

module.exports = LayerDataModel;
