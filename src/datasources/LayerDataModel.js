const amqp = require('amqplib');
const { v4: uuid } = require('uuid');

const { DataModel } = require('./DataModel');

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
}

module.exports = LayerDataModel;
