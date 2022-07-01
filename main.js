// Variables that store the values for time, min, and max.
var timer;
var min = 0;
var max = 0;
var sensorList = ['Ph', 'Turbidity', 'Cloralen'];
if(localStorage.getItem('sensorList') != null){
    sensorList = JSON.parse(localStorage.getItem('sensorList'));
}

var sensorMinValues = [0, 3, 2];
if(localStorage.getItem('sensorMinValues') != null){
    sensorMinValues = JSON.parse(localStorage.getItem('sensorMinValues'));
}

var sensorMaxValues = [5, 8, 12];
if(localStorage.getItem('sensorMaxValues') != null){
    sensorMaxValues = JSON.parse(localStorage.getItem('sensorMaxValues'));
}

var randomNumber;
var randomNumbers = '';
var sensor;
window.onload = function(){
    myFunction()
}

function myFunction(){
    const sb = document.querySelector('#sensorsList');
    for(var index = 0; index < sensorList.length; index++){
        // create a new option
        const option = new Option(sensorList[index], sensorList[index]);
        sb.add(option, undefined);
    }
}

function redirectToCreateSensor(){
    clearInterval(timer);
    document.getElementById('output').innerHTML = ''
    localStorage.setItem('sensorList', JSON.stringify(sensorList));
    localStorage.setItem('sensorMinValues', JSON.stringify(sensorMinValues));
    localStorage.setItem('sensorMaxValues', JSON.stringify(sensorMaxValues));
    window.location.href="create-sensor.html";
}

// Outputs a message based on the value selected from the sensorList
function sensorSelection(){
    sensor = document.getElementById('sensorsList');
    document.getElementById('sensorSelected').innerHTML = 'You selected: ' + sensor.value;
    let index = sensorList.indexOf(sensor.value);
    min = sensorMinValues[index];
    max = sensorMaxValues[index];
    document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';
}

function getSensorsList(){
    clearInterval(timer);
    document.getElementById('output').innerHTML = ''
}

/* When the start button is clicked then generate random numbers.
 * When the stop button is clicked then stop generating random numbers
 * While the start event is occurring, the min and max value will be displayed
 */
document.getElementById('sensorsList').addEventListener('click', getSensorsList);
document.getElementById('start').addEventListener('click', startRandomNumbers);
document.getElementById('stop').addEventListener('click', stopRandomNumbers);
document.getElementById('stop').addEventListener('click', saveData);
document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';

// Creates random numbers
function startRandomNumbers(e){
    e.preventDefault();
    randomNumber = generateRandomNumbers();
    randomNumbers += randomNumber + ", ";
    document.getElementById('output').innerHTML = randomNumber;
    timer = setInterval(function(){
        randomNumber = generateRandomNumbers();
        document.getElementById('output').innerHTML = randomNumber;
        randomNumbers += randomNumber + ", ";
    }, 1000)
    
}

// Generates a random number with the range of the min and max values
function generateRandomNumbers(){
    // find diff
    let difference = max - min + 1;
    // generate random number 
    let rand = Math.random();
    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;
    return rand;
}

// Stops generating random numbers
function stopRandomNumbers(e){
    e.preventDefault();
    // removes the last ', ' in the string
    randomNumbers = randomNumbers.slice(0, -2);
    clearInterval(timer);
}    

// Saves a random number
function saveData() {
    var numArray = randomNumbers.split(',');
    let numLength = numArray.length;
    for (let i = 0; i < numLength; i++)
    {
        console.log('we are in saveData loop');
        let data = {sensorName: sensor.value, randomValue: numArray[i]};
        console.log('num array' +numArray[i]);
        fetch("/", {
          method: "POST",
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify(data)
        }).then(res => {
          console.log("Request complete! response:", res);
        });
    }
    randomNumbers = '';
 }