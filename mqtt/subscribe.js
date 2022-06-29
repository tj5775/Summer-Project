//Dependencies
var mqtt = require("mqtt");
var client = mqtt.connect("ws://13.57.29.105:8083/mqtt");

//This is the
const MQTT_TOPIC = "61c4b89a73bba8339e58a99f";

console.log("Initializing MQTT client");

client.on("connect", function () {
  client.subscribe(MQTT_TOPIC, function (err) {
    if (!err) {
      console.log("Subscribed to topic");
    }
  });
});

client.on("message", function (topic, payload) {
  console.log("Recieved message with topic " + topic);

  var string = new TextDecoder("utf-8").decode(payload);
  string = string.replace("\0", "");

  let data = JSON.parse(string.trim());
  console.log("Random Number -- " + data.randomNum);
  console.log("\n");
});
