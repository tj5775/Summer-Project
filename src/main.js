// Variables that store the values for time, min, and max.
var timer;
var min = 0;
var max = 0;
var values = [];

callDB()

async function callDB(){
    const {Client} = require('pg')

    const client = new Client({
        user: "postgres",
        password: "summerproject123",
        host: "localhost",
        port: 5432,
        database: "postgres"
    })

    try{
        await client.connect()
        console.log("connected successfully")
        await client.query("BEGIN")
        const result = await client.query("Select * from persons")
        console.table(result.rows)
        await client.query("COMMIT")
    }
    catch(ex){
        console.log(`Failed to execute ${ex}`)
        await client.query("ROLLBACK")
    }
    finally{
        await client.end()
    }
}

// Outputs a message based on the value selected from the sensorList
function sensorSelection(){
    var sensor = document.getElementById('sensorsList');
    document.getElementById('sensorSelected').innerHTML = 'You selected: ' + sensor.value;
}

/* When the start button is clicked then generate random numbers.
 * When the stop button is clicked then stop generating random numbers
 * While the start event is occurring, the min and max value will be displayed
 */
document.getElementById('start').addEventListener('click', startRandomNumbers);
document.getElementById('stop').addEventListener('click', stopRandomNumbers);
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
    var randomNumber = generateRandomNumbers();
    document.getElementById('output').innerHTML = randomNumber;
    timer = setInterval(function(){
        randomNumber = generateRandomNumbers();
        document.getElementById('output').innerHTML = randomNumber;
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
    console.log('rand: ' + rand);

    // add with min value 
    rand = rand + min;

    return rand;
}

// Stops generating random numbers
function stopRandomNumbers(e){
    e.preventDefault();
    console.log('stop random numbers');
    clearInterval(timer);
}    