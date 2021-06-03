if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const { default: axios } = require('axios');
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/weather', (req, res) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${WEATHER_API_KEY}`;
    axios({
        url: url,
        responseType: 'json'
    }).then(data => res.json(data.data));

});

app.post('/user/getlocation', (req, res) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${req.body.latitude}&lon=${req.body.longitude}&appid=5bd21344147e7544f5a097cf37bc38bd`;
    axios({
        url: url,
        responseType: 'json'
    }).then(data => res.json(data.data));
});

app.listen('5000', () => {
    console.log('server started');
});
