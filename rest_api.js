const client = require('./database.js')
const express = require('express');
const bodyParser=require('body-parser'); 


const port = 5500;
const app = express();

// ------------- Rendering the HTML page -------------------//
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/summer-project/index.html');
});

// client.query('Select * from public.sensors',(err,res)=> {
//     console.log(err,res)
// })

app.use(bodyParser.urlencoded({extended: false}))
app.get('/stop',function(req,res){
  console.log("Data Saved");
})

//--------------------- Inserting values ----------------------//
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

app.listen(port, ()=>{
    console.log(`Sever is now listening at port ${port}`);
})