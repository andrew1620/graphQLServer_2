const DataModel = require('./DataModel');

const queues = {
  GET_ROOM: 'get_room',
  GET_ROOMS: 'get_rooms',
  GET_ROOM_ORGANIZATION: 'get_room_organization',
};

class OperatorDataModel extends DataModel {
  async getRoom(id) {
    return await this.getData({ queue: queues.GET_ROOM, message: { id } });
  }

  async getRooms() {
    return await this.getData({ queue: queues.GET_ROOMS });
  }

  async getRoomOrganization(id) {
    return await this.getData({ queue: queues.GET_ROOM_ORGANIZATION, message: { id } });
  }
}

module.exports = OperatorDataModel;
