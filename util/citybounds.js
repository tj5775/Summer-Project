//const fetch = require("node-fetch");

const OPEN_STREET_MAP_ENDPOINT =
  "https://nominatim.openstreetmap.org/search.php?q=";
const OPEN_STREET_MAP_TAIL_PARAMS = "&polygon_geojson=1&format=json";
const City = require("../models/city");
const User = require("../models/user");

function getUrl(city, state) {
  var base = OPEN_STREET_MAP_ENDPOINT;
  var end = OPEN_STREET_MAP_TAIL_PARAMS;

  //URL encode city and state strings and add them to output
  const city_arr = city.split(" ");
  const state_arr = state.split(" ");

  let mcity = "";
  let mstate = "";

  for (var v in city_arr) {
    mcity = mcity + city_arr[v] + "%20";
  }
  for (var v in state_arr) {
    mstate = mstate + state_arr[v] + "%20";
  }

  let url = base + mcity + "+" + mstate + end;
  return url;
}

var getCityBounds = async function (city, state) {
  const uri = getUrl(city, state);
  return await fetch(uri).then(async (response) => {
    return await response.json().then((data) => {
      var coordinates;
      for (var i = 0; i < data.length; i++) {
        if (data[i].class == "boundary") {
          coordinates = data[i].geojson.coordinates.flat();
          break;
        }
      }
      return coordinates;
    });
  });
};
// getCityBounds("Sunnyvale", "California").then((res) => {
//   console.log(res);
// });
// var city = { city: "Sunnyvale" };
// var state = "California";
// City.findOne(city)
//   .then((response) => {
//     if (response == null) {
//       console.log("fetching boundaries");
//       getCityBounds(city.city, state).then((response) => {
//         //console.log(response);

//         const newCity = new City({
//           city: city.city,
//           data: response,
//           state: state,
//         });

//         newCity.save().then((res) => {
//           console.log(res);
//         });
//       });
//     } else {
//       console.log(response);
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = { getCityBounds };
