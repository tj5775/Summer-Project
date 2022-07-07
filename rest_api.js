const client = require("./database.js");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const port = 5500;
const app = express();

const UserController = require("./routes/user");

// Render and load the HTML page
app.use(express.static(__dirname + "/static"));

// EJS template
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/summer-project/index.html");
});

app.get("/my-sensors", (req, res) => {

  let getQuery = "SELECT sensors_values.value, sensors_values.date, sensors_meta_data.sensor_id, name, min, " +
                 "max, topic " +
                 "FROM sensors_meta_data " +
                 "INNER JOIN sensors_values " +
                 "ON sensors_meta_data.sensor_id = sensors_values.sensor_id " +
                 "ORDER BY name;";
  console.log(getQuery);
  client.query(getQuery, (err, result) => {
    if (!err) {
      console.log(result);
      res.render('my-sensors', {dataQuery: result.rows});
    } else {
      console.log(err.message);
    }
  });
});

app.get("/generate-data", (req, res) => {

  let getQuery = "SELECT * FROM sensors_meta_data";
  client.query(getQuery, (err, result) => {
    if (!err) {
      res.render('generate-data', {dataQuery: result.rows});
    } else {
      console.log(err.message);
    }
  });
});


app.get("/getMetaData", (req, res) => {

  let getQuery = "SELECT * FROM sensors_meta_data";
  client.query(getQuery, (err, result) => {
    if (!err) {
      console.log('Data retrieval successful');
      res.send(result);
    } else {
      console.log('Data retrieval unsucessful');
    }
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/user", UserController);

app.post("/saveGeneratedData", (req, res) => {
  const { sensor_ID, randomValue } = req.body;
  console.log(sensor_ID);
  console.log(randomValue);
  let insertQuery = `insert into public.sensors_values(sensor_id, value) 
                       values('${sensor_ID}', '${Number(randomValue)}')`;
  console.log(insertQuery);
  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
      console.log(result);
    } else {
      console.log(err.message);
      res.send("Insertion unsuccessful.");
    }
  });
  //client.end();
});

app.post("/", (req, res) => {
  const { sensorName, randomValue } = req.body;
  console.log(sensorName);
  console.log(randomValue);
  let insertQuery = `insert into public.sensors(name, value) 
                       values('${sensorName}', '${Number(randomValue)}')`;
  console.log(insertQuery);
  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
      // console.log(result);
    } else {
      console.log(err.message);
      res.send("Insertion unsuccessful.");
    }
  });
});

// It creates a new record in the sensors_meta_data table
app.post("/createsensor", (req, res) => {
    const { name, min, max, topic } = req.body;
    let insertQuery = `insert into public.sensors_meta_data(name, min, max, topic) 
                        values('${name}', '${min}', '${max}', '${topic}');`;
    client.query(insertQuery, (err, result) => {
      if (!err) {
        res.send("Insertion was successful");
      } else {
        console.log(err.message);
        res.send("Insertion unsuccessful.");
      }
    });
});

// It returns all the data from the sensors_meta_data table
/*app.get("/getSensorNames", (req, res) => {
  let insertQuery = `select * from public.sensors_meta_data;`
  client.query(insertQuery, (err, result) => {
    if(!err){
      console.log('insertion was successful.');
      res.send(result);
    }
    else{
      console.log(err.message);
      return err.message;
    }
  })
});*/

// It returns the number of records where name = name and topic = topic in the DB
app.get("/topicExists/:name/:topic", (req, res) => {
  var name = req.params.name;
  var topic = req.params.topic;
  let insertQuery = `SELECT COUNT(*) FROM public.sensors_meta_data WHERE name = '${name}' AND topic = '${topic}';`;
  client.query(insertQuery, (err, result) => {
    if(!err){
      res.send(result);
    }
    else{
      console.log(err.message);
      return err.message;
    }
  })
});

// Bind and listen to the connections on localhost and port
var online =
  "mongodb+srv://aramirez:Alex123@cluster0.bii1t.mongodb.net/smartcity?retryWrites=true&w=majority";

mongoose.connect(online, { useNewUrlParser: true }).then(() => {
  app.listen(port, () => {
    console.log(`Sever is now listening at port ${port}`);
  });
});
