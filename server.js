
const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const unirest = require("axios");

//"https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD&sorting=true";
//const DATA_URL = process.env.DATA_URL.replace(/"/g, '');
//console.log(process.env.DATA_URL);

let data = [];  // [ epoc, [winnersdate : list of winners

const app = express();
const serverPort = 4000;

app.listen(serverPort, function () {  // once data is ready, start listening
	console.log(`teksystems Service is listening on port ${serverPort}`);
	console.log(`__dirname is ${__dirname}`);
})

app.use('/teksystems', express.static(path.join(__dirname, '')));  

app.get('/teksystems/getdata', async function (req, res) {  
	res.send(drawings); 
})


