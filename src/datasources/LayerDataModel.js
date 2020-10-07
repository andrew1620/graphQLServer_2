const amqp = require('amqplib');
const { AMQPPubSub } = require('graphql-amqp-subscriptions');

const DataModel = require('./DataModel');

const queues = {
  GET_LAYER: 'get_geodata_layer',
  GET_LAYERS: 'get_geodata_layers',
  CREATE_OBJECT: 'create_geodata_object',
  UPDATE_OBJECTS: 'update_geodata_objects',
  REMOVE_OBJECTS: 'remove_geodata_objects',
};

class LayerDataModel extends DataModel {
  constructor(options = {}) {
    super(options);

    this.subscriptions = {};
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

  async subscribeUpdateLayerData() {
    if (!this.subscriptions.updateLayerData) {
      this.subscriptions.updateLayerData = await amqp.connect(this.url).then((conn) => {
        return new AMQPPubSub({
          connection: conn,
          exchange: {
            name: 'updated_geodata_layer',
            type: 'fanout',
            options: {
              durable: false,
              autoDelete: false,
            },
          },
        });
      });
    }
    return this.subscriptions.updateLayerData;
  }
}

module.exports = LayerDataModel;
