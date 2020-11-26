const DataModel = require('./DataModel');

const queues = {
  GET_ORGANIZATION: 'get_organization',
  GET_ORGANIZATIONS: 'get_organizations',
  GET_ORGANIZATION_OPERATORS: 'get_organization_operators',
  GET_ORGANIZATION_ROOMS: 'get_organization_rooms',
};

class OrganizationDataModel extends DataModel {
  async getOrganization(id) {
    return await this.getData({ queue: queues.GET_ORGANIZATION, message: { id } });
  }

  async getOrganizations() {
    return await this.getData({ queue: queues.GET_ORGANIZATIONS });
  }

  async getOrganizationOperators(id) {
    return await this.getData({ queue: queues.GET_ORGANIZATION_OPERATORS, message: { id } });
  }

  async getOrganizationRooms(id) {
    return await this.getData({ queue: queues.GET_ORGANIZATION_ROOMS, message: { id } });
  }
}

module.exports = OrganizationDataModel;
