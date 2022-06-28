const client = require('./database.js');
const express = require('express');
const bodyParser=require('body-parser'); 

const port = 5500;
const app = express();

const user = {name:'Ph', value:9};
console.log(user);
let insertQuery = `insert into public.sensors(name, value) 
    values('${user.name}', '${user.value}')`

client.query(insertQuery, (err, result)=>{
    if(!err){
            console.log('Insertion was successful')
            console.log(result);
        }
        else{ console.log(err.message) }
    })
    client.end;

client.query('Select * from public.sensors',(err,res)=> {
    console.log(err,res)
})