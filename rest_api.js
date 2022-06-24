const client = require('./database.js')
const express = require('express');
const app = express();
const port = 3300;
const bodyParser=require('body-parser'); 

// ------------- Rendering the HTML page -------------------//
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.use(bodyParser.urlencoded({extended: false}))
app.get('/submit',function(req,res){
  console.log("Data Saved");
})

// ----------------- Connection with Postgres -------------------//
client.connect();

app.get('/', (req, res)=>{
    client.query(`Select * from sensors`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
})

// --------------------- Inserting values ----------------------//
app.post('/', (req, res)=> {
    const sensor = req.body;
    let insertQuery = `insert into users(firstName, value) 
                       values(${sensor.name}, '${sensor.value}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.listen(port, ()=>{
    console.log(`Sever is now listening at port ${port}`);
})