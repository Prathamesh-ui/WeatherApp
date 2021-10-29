const http = require('http');
const requests = require('requests');
const fs = require('fs');
const express = require('express');
var app = express();
const port = process.env.PORT || 8000;

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempval, originalval) => {
    let temperature = tempval.replace("{%tempval%}", (Math.round((originalval.main.temp-273.15)*100)/100));
     temperature = temperature.replace("{%tempmin%}", (Math.round((originalval.main.temp_min-273.15)*100)/100));
     temperature = temperature.replace("{%tempmax%}", (Math.round((originalval.main.temp_max-273.15)*100)/100));
     temperature = temperature.replace("{%location%}", originalval.name);
     temperature = temperature.replace("{%country%}", originalval.sys.country);
     temperature = temperature.replace("{%tempstatus%}", originalval.weather[0].main);
     return temperature;
    }

    const q = "Pune";

app.get('/', (req, res)=>{
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${!req.query.name?q:req.query.name}&appid=8141df562492c31d6b98a32819f7efa8`)
    .on('data', (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);
    })
    
    .on('end', function (err) {
        if (err) return console.log('connection closed due to errors');
        res.end();
    });
})


app.listen(port, "http");
