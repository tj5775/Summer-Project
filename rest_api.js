const client = require('./database.js')
const express = require('express');
const bodyParser=require('body-parser'); 


const port = 5500;
const app = express();

// Render and load the HTML page
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/summer-project/index.html');
});

app.use(bodyParser.urlencoded({extended: false}))

// client.query('Select * from public.sensors',(err,res)=> {
//     console.log(err,res)
// })


// Insert values into Postgres Table
app.post('/', (req, res)=> {
    const user = req.body;
    let insertQuery = `insert into public.sensors(name, value) 
                       values('${user.sensorsList}', '${user.output}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

// Bind and listen to the connections on localhost and port
app.listen(port, ()=>{
    console.log(`Sever is now listening at port ${port}`);
})