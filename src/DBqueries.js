callDB()

async function callDB(){
    const {Client} = require('pg')

    const client = new Client({
        user: "postgres",
        password: "summerproject123",
        host: "localhost",
        port: 5432,
        database: "postgres"
    })

    try{
        await client.connect()
        console.log("connected successfully")
        await client.query("BEGIN")
        const result = await client.query("Select * from persons")
        console.table(result.rows)
        await client.query("COMMIT")
    }
    catch(ex){
        console.log(`Failed to execute ${ex}`)
        await client.query("ROLLBACK")
    }
    finally{
        await client.end()
    }
}