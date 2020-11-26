const DataModel = require('./DataModel');

const queues = {
  GET_OPERATOR: 'get_operator',
  GET_OPERATORS: 'get_operators',
  GET_OPERATOR_ORGANIZATION: 'get_operator_organization',
  GET_OPERATOR_ACCESS_ROOMS: 'get_operator_access_rooms',
};

class OperatorDataModel extends DataModel {
  async getOperator(id) {
    return await this.getData({ queue: queues.GET_OPERATOR, message: { id } });
  }

  async getOperators() {
    return await this.getData({ queue: queues.GET_OPERATORS });
  }

  async getOperatorOrganization(id) {
    return await this.getData({ queue: queues.GET_OPERATOR_ORGANIZATION, message: { id } });
  }

  async getOperatorAccessRooms(id) {
    return await this.getData({ queue: queues.GET_OPERATOR_ACCESS_ROOMS, message: { id } });
  }
}

module.exports = OperatorDataModel;
