const client = require('./database.js')
const express = require('express');
const app = express();
const port = 5500;
const bodyParser=require('body-parser'); 

// ------------- Rendering the HTML page -------------------//
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "summer-project/index.html");
});


app.use(bodyParser.urlencoded({extended: false}))
app.get('/output',function(req,res){
  console.log("Data Saved");
})

// ----------------- Connection with Postgres and creating a table -------------------//
client.connect(function(err) {
    if (err) throw err;
    console.log('Connected to the database!');
    let query = "CREATE TABLE IF NOT EXISTS sensors (sensor_id serial PRIMARY KEY, name VARCHAR(50) NOT NULL, value INT, date DATE DEFAULT now())";
    client.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
    })

})

// --------------------- Inserting values ----------------------//
app.post('/', (req, res)=> {
    const sensor = req.body;
    let insertQuery = 'insert into sensors(name, value) VALUES ?'; 
    data = [ [req.body.sensorsList, req.body.output]]

    client.query(insertQuery, [data], (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.get('/', (req, res)=>{
    client.query(`Select * from sensors`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
})



app.listen(port, ()=>{
    console.log(`Sever is now listening at port ${port}`);
})