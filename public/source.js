// fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5bd21344147e7544f5a097cf37bc38bd`)
import getCityList from './assets/assets.js';
const cityList = getCityList();
const searchBox = document.querySelector('[data-city-search]');
const cityBox = document.querySelector('[data-city-box]');
const titleDOM = document.querySelector('[data-weather-title');
const tempDOM = document.querySelector('[data-weather-temp');
const summaryDOM = document.querySelector('[data-weather-summary');
const windDOM = document.querySelector('[data-weather-wind');
const humidityDOM = document.querySelector('[data-weather-humidity');
const weatherDOM = document.querySelector('[data-weather-weather');
const weatherICON = document.querySelector('[data-icon-weather]');
const icon = [
    {
        weather: '01n',
        icon: 'sun'
    },
    {
        weather: '02n',
        icon: 'cloudy'
    },
    {
        weather: '03n',
        icon: 'cloudy'
    },
    {
        weather: '04n',
        icon: 'cloudy-2'
    },
    {
        weather: '09n',
        icon: 'showers'
    },
    {
        weather: '10n',
        icon: 'rainy'
    },
    {
        weather: '11n',
        icon: 'thunderstorm'
    },
    {
        weather: '13n',
        icon: 'snowy'
    },
    {
        weather: '50n',
        icon: 'mist'
    }
]
function clearEffect() {
    cityBox.style.display = 'none';
    searchBox.value = '';
    searchBox.style.display = 'none';
}

function setWeather(data) {
    const temp = Math.ceil(data.main.temp - 273.15);
    const city = data.name;
    const summary = data.weather[0].description;
    const wind = Math.ceil(Number(data.wind.speed));
    const humidity = data.main.humidity;
    const weather = data.weather[0].main;
    // CHANGE DOM
    titleDOM.innerText = city;
    tempDOM.innerText = temp;
    summaryDOM.innerText = summary;
    windDOM.innerText = wind;
    humidityDOM.innerText = humidity;
    weatherDOM.innerText = weather;
    // ICON
    let iconDOM = null;
    for (let x = 0; x < icon.length; x++) {
        if (icon[x].weather === data.weather[0].icon) {
            iconDOM = icon[x].icon;
        }
    }
    if (iconDOM != null) {
        weatherICON.innerHTML = `<i class="ri-${iconDOM}-line">`
    } else {
        weatherICON.innerHTML = `<i class="ri-cloudy-line">`
    }
}

searchBox.addEventListener('keyup', e => {
    cityBox.innerHTML = '';
    let current, result = [], el;
    let val = searchBox.value;
    const minLet = 2;
    if (val.length < minLet) {
        cityBox.style.display = 'none';
        return;
    }
    // checking and filter city list to search value
    for (let country in cityList) {
        current = cityList[country].filter(city => city.toLowerCase().startsWith(val));
        result = [...result, ...current];
    }
    result = Array.from(new Set(result));
    // append city to citybox
    if (result.length > 0) {
        cityBox.style.display = 'block';
        const maxAutoComp = 10;
        for (let x = 0; x < result.length && x < maxAutoComp; x++) {
            el = `<div class="city" data-city>${result[x]}</div>`;
            cityBox.innerHTML += el;
        }
        return;
    }
    cityBox.innerHTML += `<div class="err-loc err">location not found</div>`
});

cityBox.addEventListener('click', e => {
    if (e.target.classList.contains('city')) {
        let city = e.target.innerText;
        fetch('./weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                city: city
            })
        }).then(res => res.json()).then(data => {
            setWeather(data);
        })
        clearEffect();
    }
});

// CONTENT AFTER LOADED
const success = (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    fetch('/user/getlocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            latitude: lat,
            longitude: lon
        })
    }).then(res => res.json()).then(data => {
        setWeather(data);
    });
}

const failure = (err) => {
    console.log(err);
}

if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(success, failure);
} else {
    console.log(false);
}

// LOCATION BUTTON
const locBtn = document.querySelector('[data-btn-loc]');
const searchCtr = document.querySelector('[data-ctr-search]');
locBtn.addEventListener('click', e => {
    if (searchBox.style.display === 'block') {
        searchBox.style.display = 'none';
        return;
    }
    searchBox.style.display = 'block';
    searchBox.focus();
});

// TIME HANDLER

const bgUI = document.querySelector('[data-img-bgUI]');
const dateDOM = document.querySelector('[data-weather-date]');
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function addZero(target) {
    return target < 10 ? `0${target}` : target;
}

function getTimeDesc(hour) {
    if (hour > 6 && hour < 11) {
        return 'morning';
    } else if (hour >= 11 && hour < 18) {
        return 'evening';
    } else {
        return 'night';
    }
}

function timeHandler() {
    const date = new Date();
    const hour = date.getHours();
    const timeDOM = getTimeDesc(hour);
    return timeDOM;
}

function setTime() {
    const time = timeHandler();
    setTimeUI(time);
}

function setTimeDOM() {
    const dates = new Date();
    const date = dates.getDate();
    console.log(date);
    const month = months[dates.getMonth()];
    const year = dates.getFullYear();
    dateDOM.innerText = `${addZero(date)} ${month}, ${year}`;
}

function setTimeUI(time) {
    const img = `http://localhost:5000/assets/${time}.jpg`;
    bgUI.src = img;
}
setInterval(() => {
    setTime();
    setTimeDOM();
}, 60000);

// INVOCATION

setTime();
setTimeDOM();