const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var path = require('path');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/" , function(req , res){
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/" , function(req,res){
    const query = req.body.cityName;
    const apikey = "8568ecb72bdf543717768c889a19c706";
    const units = "metric"
    const url = "https://api.openweathermap.org/data/2.5/forecast?appid="+ apikey + "&q="+ query +"&units="+ units +"";

    https.get(url ,function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            const country = weatherData.list[0].sys.country
            const temp = weatherData.list[0].main.temp
            const pressure = weatherData.list[0].main.pressure
            const feelslike = weatherData.list[0].main.feels_like
            const icon = weatherData.list[0].weather[0].icon
            const wind = weatherData.list[0].wind.speed  
            const humidity = weatherData.list[0].main.humidity   
            const weatherDescription = weatherData.list[0].weather[0].description
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

            // res.write("<h1>The Temperature in " + query + " is " + temp + " degrees Celcius</h1>");
            // res.write("<p>The weather is currently " + weatherDescription + "</p>");
            // res.write("<img src=" + imageURL +">");
            // res.send()

            res.render('list',{City : query ,
                Country : country,
                Temp : temp,
                Description : weatherDescription, 
                WeatherImg : imageURL,
                WindSpeed : wind,
                FeelsLike : feelslike, 
                Humidity : humidity,
                Pressure : pressure,
            });

        });
    });

})

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});