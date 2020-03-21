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
              color: "blue"
            },
            showLength: true
          },
          polygon: {
            shapeOptions: {
              color: "blue"
            }
          },
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          edit: false
        }
      }
    }
  ],
  objects: {
    endpoint: "real_data:detect_info_2-line",
    types: [
      {
        id: "1",
        format: {
          rectangle: [
            [300, 100],
            [350, 200]
          ]
        }
      }
    ]
  }
};
const testDB = [testLayer]; //Тестовые данные

class LayerAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://earthquake.usgs.gov/fdsnws/event/1/";
  }

  async getAllLayers() {
    // const query =
    //   "query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";
    // const response = await this.get(query);
    // return Array.isArray(response.features)
    //   ? //Должен возвращать массив слоев, пока сделал заглушку в виде массива с 1 слоем
    //     // response.features.map(layer => this.layerReducer(layer))
    //     [this.layerReducer(response.features[0])]
    //   : [];

    // // return [this.layerReducer(getData())];
    return [this.layerReducer(testDB[0])];
  }

  changeLayer(data) {
    testDB[0] = data;
    // return [this.layerReducer(testDB[0])];
  }

  addLayer(data) {
    senData(data);
    return this.layerReducer("Successful");
  }

  layerReducer(layer) {
    return {
      id: layer.id,
      name: "layer 1",
      services: [
        {
          service: "editable",
          options: {
            draw: {
              polyline: {
                shapeOptions: {
                  color: "blue"
                },
                showLength: true
              },
              polygon: {
                shapeOptions: {
                  color: "blue"
                }
              },
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false
            },
            edit: {
              edit: false
            }
          }
        }
      ],
      objects: {
        endpoint: "real_data:detect_info_2-line",
        types: [
          {
            id: "1",
            format: {
              rectangle: [
                [300, 100],
                [350, 200]
              ]
            }
          }
        ]
      }
    };
  }
}

module.exports = LayerAPI;
