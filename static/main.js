// Variables that store the values for time, min, and max.
var timer;
var min = 0;
var max = 0;
var sensorList = ["Ph", "Turbidity", "Cloralen"];
var sensorMinValues = [0, 3, 2];
var sensorMaxValues = [5, 8, 12];
var errorMsg = [];
var addSensorForm = document.getElementById("addSensorForm");
addSensorForm.style.display = "none";
var displayErrorMsg = document.getElementById("errorMsg");
displayErrorMsg.style.display = "none";

// Outputs a message based on the value selected from the sensorList
// function sensorSelection(){
//     var sensor = document.getElementById('sensorsList');
//     console.log(sensorList);
var randomNumber;
var randomNumbers = "";
var sensor;

if (localStorage.getItem("SavedToken") === null) {
  window.location.href = "login.html";
}
//MQTT EXAMPLE
//<----------------------------------------------
var client = mqtt.connect("ws://13.57.29.105:8083/mqtt");
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
//----------------------------------------------------->

// Outputs a message based on the value selected from the sensorList
function sensorSelection() {
  sensor = document.getElementById("sensorsList");
  document.getElementById("sensorSelected").innerHTML =
    "You selected: " + sensor.value;
  let index = sensorList.indexOf(sensor.value);
  document.getElementById("minValue").value = sensorMinValues[index];
  document.getElementById("maxValue").value = sensorMaxValues[index];
  min = sensorMinValues[index];
  max = sensorMaxValues[index];
  document.getElementById("msgRandomRange").innerHTML =
    "Random numbers from " + min + " to " + max + ":";
}

function getSensorsList() {
  const sb = document.querySelector("#sensorsList");

  var i,
    L = sb.options.length - 1;
  for (i = L; i >= 1; i--) {
    sb.remove(i);
  }

  for (var index = 0; index < sensorList.length; index++) {
    // create a new option
    const option = new Option(sensorList[index], sensorList[index]);
    sb.add(option, undefined);
  }
}

function displaySensorForm(e) {
  e.preventDefault();
  var addSensorBtn = document.getElementById("addSensorBtn");
  addSensorBtn.style.display = "none";
  addSensorForm.style.display = "block";
}

function addSensor(e) {
  e.preventDefault();
  errorMsg = [];
  var sensorName = document.getElementById("newSensor").value;

  if (sensorList.includes(sensorName)) {
    console.log(`Sensor ${sensorName} already exist`);
    errorMsg.push(`Sensor ${sensorName} already exist`);
  }
  if (sensorName === "") {
    console.log(`Please enter a sensor name`);
    errorMsg.push(`Please enter a sensor name`);
  }
  document.getElementById("errorMsg").innerHTML = errorMsg;

  if (errorMsg.length > 0) {
    displayErrorMsg.style.display = "contents";
  } else {
    min = Number(document.getElementById("minValue").value);
    max = Number(document.getElementById("maxValue").value);
    sensorMinValues.push(min);
    sensorMaxValues.push(max);
    sensorList.push(sensorName);

    var addSensorBtn = document.getElementById("addSensorBtn");
    addSensorBtn.style.display = "inline";

    var addSensorForm = document.getElementById("addSensorForm");
    addSensorForm.style.display = "none";
  }
}

/* When the start button is clicked then generate random numbers.
 * When the stop button is clicked then stop generating random numbers
 * While the start event is occurring, the min and max value will be displayed
 */
document
  .getElementById("sensorsList")
  .addEventListener("click", getSensorsList);
document
  .getElementById("addSensorBtn")
  .addEventListener("click", displaySensorForm);
document.getElementById("addBtn").addEventListener("click", addSensor);
document.getElementById("start").addEventListener("click", startRandomNumbers);
document.getElementById("stop").addEventListener("click", stopRandomNumbers);
document.getElementById("stop").addEventListener("click", saveData);
document.getElementById("minValue").addEventListener("change", displayMsgRange);
document.getElementById("maxValue").addEventListener("change", displayMsgRange);
document.getElementById("msgRandomRange").innerHTML =
  "Random numbers from " + min + " to " + max + ":";

// Displays the range of the generated value
function displayMsgRange() {
  min = Number(document.getElementById("minValue").value);
  max = Number(document.getElementById("maxValue").value);
  if (min <= 0) {
    document.getElementById("minValue").value = 0;
    min = 0;
  }
  if (max < min) {
    document.getElementById("maxValue").value = min;
    max = min;
  }
  document.getElementById("msgRandomRange").innerHTML =
    "Random numbers from " + min + " to " + max + ":";
}

// Creates random numbers
function startRandomNumbers(e) {
  e.preventDefault();
  randomNumber = generateRandomNumbers();
  randomNumbers += randomNumber + ", ";
  document.getElementById("output").innerHTML = randomNumber;
  timer = setInterval(function () {
    randomNumber = generateRandomNumbers();
    document.getElementById("output").innerHTML = randomNumber;
    randomNumbers += randomNumber + ", ";
  }, 1000);
}

// Generates a random number with the range of the min and max values
function generateRandomNumbers() {
  // find diff
  let difference = max - min + 1;
  // generate random number
  let rand = Math.random();
  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;
  return rand;
}

// Stops generating random numbers
function stopRandomNumbers(e) {
  e.preventDefault();
  // removes the last ', ' in the string
  randomNumbers = randomNumbers.slice(0, -2);
  clearInterval(timer);
}

// Saves a random number
function saveData() {
  var numArray = randomNumbers.split(",");
  let numLength = numArray.length;
  console.log(numArray);
  for (let i = 0; i < numLength; i++) {
    console.log("we are in saveData loop");
    let data = { sensorName: sensor.value, randomValue: numArray[i] };
    console.log("num array" + numArray[i]);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log("Request complete! response:", res);
    });
  }
  randomNumbers = "";
}
