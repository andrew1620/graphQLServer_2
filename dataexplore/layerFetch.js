const fetch = require("node-fetch");
const url =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";

fetch(url)
  .then(response => response.json())
  .then(layersData => {
    // console.log(layersData.features[0]);
    const layer = layersData.features[0];
    //формируем необходимый объект на основе полученных данных
    const customData = {
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
            id: "unmanned_aerial_vehicle:flight_mission",
            format: "format1"
          },
          {
            id: "unmanned_aerial_vehicle:position",
            format: "format2"
          }
        ]
      }
    };
  });
