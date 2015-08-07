/*!
 * Basic Weather API Application
 * Thomas Boop
 */

var express = require('express');
var request = require('request');
var cfenv = require('cfenv');

var path = require('path');
var app = express();
var apiKey = '355e806e0c6b3aa9c5c24c36144d073b';
var apiEndpoint = 'http://api.openweathermap.org/data/2.5/weather';
app.set('view engine', 'jade');

//Starting page for app, redirects to /weather
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/html/home.html'));
});

//Detailed view form of application, should return a html page
app.get('/weather', function (req, res) {
    getWeather(req.query.city,req.query.units,res,1);
});

//Api form of application, should return json
app.get('/weatherApi',function (req,res){
    getWeather(req.query.city,req.query.units,res,0);
});


var appEnv = cfenv.getAppEnv()
//Start the server and listen on port 3000
var server = app.listen(appEnv.port, function () {
    console.log('Example Weather app listening at http://%s:%s',appEnv.url,port);
});


/*Sends get request to open weather map server and parses the response if it succeeds
 * @param city String that contains a zip code or city name
 * @param units string that is either Imperial, Standard, or Metric to denote unit
 * @param res response stream to send response to
 * @param detailed boolean flag (1 or 0) to show detailed html or send json

 */
function getWeather(city,units,res,detailed){
    console.log('Requesting weather for: '+ city + ' with unit: ' + units);
    if(isNaN(city)) //user entered a city, send to the city api
        var url = apiEndpoint + '?q=' + city + '&units=' + units + '&key=' + apiKey;
	else //user entered a number, assume it is a zip code and send to zip api
        var url = apiEndpoint+'?zip='+ city + '&units=' + units + '&key=' + apiKey;
    //Send the request
    request.get(url,
	function (error, response, body) {
        if( !error && response.statusCode == 200) {
		   parseResponse(body,res,detailed);
		}
        else
            res.send(body);
	});
};


/*Parses the weather API response
 * @param response response from the weather api server to parse
 * @param res response stream to send response to
 * @param detailed boolean flag (1 or 0) to show detailed html or send json
 */
function parseResponse(response,res, detailed){
    var parsedData = JSON.parse(response);
    if(parsedData.cod != 200) { //Was not able to get data for that city, just send back the server error
        res.send(response);
        return;
    }
    
    //display the data in json response or a detailed view based on flag   
    if(detailed != 1){ //simple json response
        var formattedResponse= '{'
            +'"lon":"' + parsedData.coord.lon
            +'","lat":"' + parsedData.coord.lat
            +'","city":"' + parsedData.name
            +'","type":"' + parsedData.weather[0].main
            +'","high":"' + parsedData.main.temp_max
            +'","low":"' + parsedData.main.temp_min
            +'","current":"' +parsedData.main.temp
            +'","icon":"' + parsedData.weather[0].icon + '"'
            +'}';
        res.send(formattedResponse);
    }
    
    else //detailed view using jade
        res.render(path.join(__dirname, '/public/views/weather.jade'),{ lon : parsedData.coord.lon, 
            lat : parsedData.coord.lat,           
            city : parsedData.name, 
            type : parsedData.weather[0].main,           
            high : parsedData.main.temp_max, 
            low : parsedData.main.temp_min,           
            current :parsedData.main.temp, 
            icon : parsedData.weather[0].icon        
        });
};


