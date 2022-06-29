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
    let query = "CREATE TABLE IF NOT EXISTS sensors (sensor_id serial PRIMARY KEY, name VARCHAR(50) NOT NULL, value Int, dateTime TIMESTAMP(0) DEFAULT now())";
    client.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
    })
})

module.exports = client