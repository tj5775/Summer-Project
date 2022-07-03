const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "password",
    database: "postgres"
})

// ----------------- Connection with Postgres and creating a table -------------------//
client.connect(function(err) {
    if (err) throw err;
    console.log('Connected to the database!');
    let query = "CREATE TABLE IF NOT EXISTS Sensors_meta_data(sensor_id SERIAL PRIMARY KEY, name VARCHAR(64) NOT NULL, min INT NOT NULL, max INT NOT NULL, topic VARCHAR(64) NOT NULL)";
    client.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
    })
    query = "CREATE TABLE IF NOT EXISTS Sensors_values(sensor_id SERIAL PRIMARY KEY, value INT NOT NULL, date TIMESTAMP(0) DEFAULT now(), FOREIGN KEY(sensor_id) REFERENCES Sensors_meta_data(sensor_id))";
    client.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
    })
})

module.exports = client