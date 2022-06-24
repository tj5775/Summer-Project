const client = require('./database.js')
const express = require('express');
const app = express();

app.listen(3300, ()=>{
    console.log("Sever is now listening at port 3300");
})

client.connect();

app.get('/', (req, res)=>{
    client.query(`Select * from sensors`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
})

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