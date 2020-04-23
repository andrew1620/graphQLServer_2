const { RESTDataSource } = require("apollo-datasource-rest");

const { getData } = require("./recieve_log_topic");
const { senData } = require("./send");

const testLayer = {
  id: "testID",
  name: "layer 1",
  services: [
    {
      service: "editable",
      options: {
        draw: {
          polyline: {
            shapeOptions: {
              color: "blue",
            },
            showLength: true,
          },
          polygon: {
            shapeOptions: {
              color: "blue",
            },
          },
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          edit: false,
        },
      },
    },
  ],
  objects: {
    endpoint: "real_data:detect_info_2-line",
    types: [
      {
        id: 1,
        format: {
          rectangle: [
            [300, 100],
            [350, 200],
          ],
        },
      },
      {
        id: 2,
        format: {
          rectangle: [
            [400, 100],
            [450, 200],
          ],
        },
      },
    ],
  },
};
const testDB = [testLayer]; //Тестовые данные

class LayerAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://earthquake.usgs.gov/fdsnws/event/1/";
  }

  async getAllLayers() {
    //Должен возвращать массив слоев, пока сделал заглушку в виде массива с 1 слоем
    // // return [this.layerReducer(getData())];
    return testDB;
  }

  changeLayer(layer) {
    console.log("layerFetched --- ", layer);

    testDB[0] = { ...testDB[0], ...this.layerReducer(layer) };

    console.log("changed testDB --- ", testDB[0].objects);

    return testDB[0];
  }

  deleteLayer(id) {
    testDB[0] = { ...testDB[0], ...this.deleteLayerReducer(id) };
    console.log("after deleting --- ", testDB[0].objects);
  }

  layerReducer(layer) {
    //Как обычный reducer, можно пропустить через него данные как через фильтр и поменять то, что необходимо
    return {
      ...testDB[0],
      objects: {
        ...testDB[0].objects,
        types: [
          ...testDB[0].objects.types,
          {
            ...layer.objects.types[0],
            id: +testDB[0].objects.types[testDB[0].objects.types.length - 1].id + 1,
          },
        ],
      },
    };
  }

  changeObjectBorders(objectData) {
    testDB[0] = { ...testDB[0], ...this.changeObjectBordersReducer(objectData) };
    console.log("after changing object borders --- ", testDB[0].objects);
  }

  changeObjectBordersReducer({ id, newBounds }) {
    return {
      ...testDB[0],
      objects: {
        ...testDB[0].objects,
        types: testDB[0].objects.types.map((object) => {
          if (object.id === +id)
            return { ...object, format: { ...object.format, rectangle: newBounds } };
          else return object;
        }),
      },
    };
  }

  deleteLayerReducer(id) {
    console.log(testDB[0].objects.types[1].id, "--- ", +id);
    return {
      ...testDB[0],
      objects: {
        ...testDB[0].objects,
        types: testDB[0].objects.types.filter((object) => object.id !== +id),
      },
    };
  }
}

module.exports = LayerAPI;
