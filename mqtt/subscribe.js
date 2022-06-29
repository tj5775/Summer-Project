var mqtt = require("mqtt");
var client = mqtt.connect("ws://13.57.29.105:8083/mqtt");

const MQTT_TOPIC = "61c4b89a73bba8339e58a99f";

console.log("Initializing MQTT client");

client.on("connect", function () {
  client.subscribe("61c4b89a73bba8339e58a99f", function (err) {
    if (!err) {
      console.log("Subscribed to topic");
    }
  });
});

client.on("message", function (topic, payload) {
  console.log(topic);
  var string = new TextDecoder("utf-8").decode(payload);
  string = string.replace("\0", "");
  let myObj;

  myObj = JSON.parse(string.trim());
  console.log(
    myObj.ts +
      "-- Message from site: " +
      myObj.sn +
      " | Sensor: " +
      topic +
      " | Mac Adress: " +
      myObj.mac
  );

  myObj.topic = topic;
});
