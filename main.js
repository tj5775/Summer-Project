var timer;
var min = 0;
var max = 0;

function sensorSelection(){
    var sensor = document.getElementById('sensorsList');
    document.getElementById('sensorSelected').innerHTML = 'You selected: ' + sensor.value;
}

document.getElementById('start').addEventListener('click', startRandomNumbers);
document.getElementById('stop').addEventListener('click', stopRandomNumbers);
document.getElementById('minValue').addEventListener('change', displayMsgRange);
document.getElementById('maxValue').addEventListener('change', displayMsgRange);
document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';

function displayMsgRange(){
    min = Number(document.getElementById('minValue').value);
    max = Number(document.getElementById('maxValue').value);
    document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';
}

function startRandomNumbers(e){
    e.preventDefault();
    console.log('start random numbers');
    // let min = document.getElementById('minValue').value;
    // let max = document.getElementById('maxValue').value;
    // document.getElementById('msgRandomRange').innerHTML = 'Random numbers from ' + min + ' to ' + max + ':';
    var randomNumber = generateRandomNumbers();
    document.getElementById('output').innerHTML = randomNumber;
    timer = setInterval(function(){
        randomNumber = generateRandomNumbers();
        document.getElementById('output').innerHTML = randomNumber;
    }, 1000)
    
}
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
    console.log('rand: ' + rand);

    // add with min value 
    rand = rand + min;

    return rand;
}

function stopRandomNumbers(e){
    e.preventDefault();
    console.log('stop random numbers');
    clearInterval(timer);
}    