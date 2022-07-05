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

app.get("/:userQuery", (req, res) => {

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/user", UserController);

// app.post("/", (req, res) => {
//   const { sensorName, randomValue } = req.body;
//   console.log(sensorName);
//   console.log(randomValue);
//   let insertQuery = `insert into public.sensors(name, value) 
//                        values('${sensorName}', '${Number(randomValue)}')`;
//   console.log(insertQuery);
//   client.query(insertQuery, (err, result) => {
//     if (!err) {
//       res.send("Insertion was successful");
//       console.log(result);
//     } else {
//       console.log(err.message);
//       res.send("Insertion unsuccessful.");
//     }
//   });
//   //client.end();
// });

app.post("/", (req, res) => {
    const { name, min, max, topic } = req.body;
    // console.log(name);
    // console.log(min);
    // console.log(max);
    // console.log(topic);
    let insertQuery = `insert into public.sensors_meta_data(name, min, max, topic) 
                        values('${name}', '${Number(min)}', '${Number(max)}', '${topic}')`;
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

// Bind and listen to the connections on localhost and port
var online =
  "mongodb+srv://aramirez:Alex123@cluster0.bii1t.mongodb.net/smartcity?retryWrites=true&w=majority";

mongoose.connect(online, { useNewUrlParser: true }).then(() => {
  app.listen(port, () => {
    console.log(`Sever is now listening at port ${port}`);
  });
});
