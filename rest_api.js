//todo uncomment
// const client = require('./database.js')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = 5500;
const app = express();

const UserController = require("./routes/user");

// Render and load the HTML page
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/summer-project/index.html");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/user", UserController);

// Insert values into Postgres Table
//todo uncomment

// app.post('/', (req, res)=> {
//     const {sensorName, randomValue} = req.body;
//     console.log(sensorName);
//     console.log(randomValue);
//     let insertQuery = `insert into public.sensors(name, value) 
//                        values('${sensorName}', '${Number(randomValue)}')`
//     console.log(insertQuery);
//     client.query(insertQuery, (err, result)=>{
//         if(!err){
//             res.send('Insertion was successful')
//             console.log(result);
//         }
//         else{ console.log(err.message)
//               res.send('Insertion unsuccessful.') }
//     })
//     //client.end();
// })

// Bind and listen to the connections on localhost and port

var online =
  "mongodb+srv://aramirez:Alex123@cluster0.bii1t.mongodb.net/smartcity?retryWrites=true&w=majority";

mongoose.connect(online, { useNewUrlParser: true }).then(() => {
  app.listen(port, () => {
    console.log(`Sever is now listening at port ${port}`);
  });
});
