// Variables that store the values for time, min, and max.
var timer;
var min = 0;
var max = 0;
var randomNumber;
var randomNumbers = '';
var sensor;
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
function sensorSelection(){
    sensor = document.getElementById('sensorsList');
    document.getElementById('sensorSelected').innerHTML = 'You selected: ' + sensor.value;
}

/* When the start button is clicked then generate random numbers.
 * When the stop button is clicked then stop generating random numbers
 * While the start event is occurring, the min and max value will be displayed
 */
document.getElementById('start').addEventListener('click', startRandomNumbers);
document.getElementById('stop').addEventListener('click', stopRandomNumbers);
document.getElementById('stop').addEventListener('click', saveData);
document.getElementById('minValue').addEventListener('change', displayMsgRange);
document.getElementById('maxValue').addEventListener('change', displayMsgRange);
document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';

// Displays the range of the generated value
function displayMsgRange(){
    min = Number(document.getElementById('minValue').value);
    max = Number(document.getElementById('maxValue').value);
    document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';
}

// Creates random numbers
function startRandomNumbers(e){
    e.preventDefault();
    console.log('start random numbers');
    // let min = document.getElementById('minValue').value;
    // let max = document.getElementById('maxValue').value;
    // document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';
    randomNumber = generateRandomNumbers();
    randomNumbers += randomNumber + ", ";
    document.getElementById('output').innerHTML = randomNumber;
    timer = setInterval(function(){
        randomNumber = generateRandomNumbers();
        document.getElementById('output').innerHTML = randomNumber;
        randomNumbers += randomNumber + ", ";
        console.log(randomNumbers);
    }, 1000)
    
}

// Generates a random number with the range of the min and max values
function generateRandomNumbers(){
    console.log('random numbers');
    // let min = Number(document.getElementById('minValue').value);
    // let max = Number(document.getElementById('maxValue').value);
    // find diff
    let difference = max - min + 1;
    // generate random number 
    let rand = Math.random();
    console.log('rand: ' + rand);
    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;

    console.log('rand: ' + rand);
    return rand;
}

// Stops generating random numbers
function stopRandomNumbers(e){
    e.preventDefault();
    console.log('stop random numbers');
    // removes the last ', ' in the string
    randomNumbers = randomNumbers.slice(0, -2);
    clearInterval(timer);
}    

// Saves a random number
function saveData() {
    let numLength = randomNumbers.length;
    console.log(randomNumbers);
    console.log('We are in saveData loop');
    let data = {sensorName: sensor.value, randomValue: randomNumbers};
    fetch("/", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
    }).then(res => {
        console.log("Request complete! response:", res);
    });
 }