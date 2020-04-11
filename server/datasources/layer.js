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
        id: "1",
        format: {
          rectangle: [
            [300, 100],
            [350, 200],
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

    console.log("changed testDB --- ", testDB[0].objects.types[1].format.rectangle);

    return testDB[0];
  }

  layerReducer(layer) {
    //Как обычный reducer, можно пропустить через него данные как через фильтр и поменять то, что необходимо
    // return {
    //   id: testDB[0].id,
    //   name: `Обработанный через редьюсер ${layer.name}`,
    //   services: [...testDB[0].services],
    //   objects: {
    //     endpoint: "real_data:detect_info_2-line",
    //     types: [...testDB[0].objects.types, ...layer.objects.types],
    //   },
    // };
    return {
      ...testDB[0],
      objects: {
        ...testDB[0].objects,
        types: [...testDB[0].objects.types, ...layer.objects.types],
      },
    };
  }
}

module.exports = LayerAPI;
