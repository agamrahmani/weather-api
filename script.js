const iconsMapping = {
    '01d': '🌞',
    '02d': '🌤️',
    '03d': '☁️',
    '04d': '☁️',
    '09d': '🌧️',
    '10d': '🌦️',
    '11d': '🌩️',
    '13d': '❄️',
    '50d': '🌫️',
    '01n': '🌚',
    '02n': '🌤️',
    '03n': '☁️',
    '04n': '☁️',
    '09n': '🌧️',
    '10n': '🌦️',
    '11n': '🌩️',
    '13n': '❄️',
    '50n': '🌫️',

};

const search = document.getElementById('search');
const apiKey = "1d4056c7d6125d67846bd37c39d0abab";

const city = document.getElementById('city');
const description = document.getElementById('description');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const icon = document.getElementById('icon');
const containerWeather = document.getElementById('container-weather');

let geocodingData;
let dataCity;
let code;
let isUSA = false;


search.addEventListener('input', function (event) {
    containerWeather.style.display = 'none';
});


function getGeocodingThen() {
    const word = search.value;

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${word}&limit=1&appid=${apiKey}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            } else {
                return res.json();
            }
        }).then((data) => {
            console.log(data);
            geocodingData = data;
            getDataThen(geocodingData);
        })
        .catch((err) => {
            console.log(err);
            if (!isUSA) {
                cityUSA(word);
                isUSA = true;
            }
        }
        );
}

function cityUSA(word) {
    fetch(`https://api.geonames.org/searchJSON?q=${word}&countryBias=US&maxRows=1&username=agamrahmani2904`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            } else {
                return res.json();
            }
        }).then((data) => {
            if (data.geonames[0].countryCode == 'US') {
                code = data.geonames[0].adminCode1;
                getGeocodingUSAThen(word, code);
            }
        })
        .catch((err) => console.log(err));
}

function getGeocodingUSAThen(word, code) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${word},${code},US&limit=1&appid=${apiKey}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            } else {
                return res.json();
            }
        }).then((data) => {
            geocodingData = data;
            getDataThen(geocodingData);
        })
        .catch((err) => console.log(err));
}

function getDataThen(geocodingData) {
    const lat = geocodingData[0].lat;
    const lon = geocodingData[0].lon;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            } else {
                return res.json();
            }
        }).then((data) => {
            isUSA = false;
            if (isHebrew()) {
                showDataHebrow(data);
            }
            else {
                showDataEnglish(data);
            }
        })
        .catch((err) => console.log(err));
}

function showDataEnglish(dataCity) {
    let valueDes = dataCity.weather[0].description;
    const valueTemp = Math.ceil((dataCity.main.temp) - 273.15);
    const valueFeels = Math.ceil((dataCity.main.feels_like) - 273.15);
    const valueHumidity = dataCity.main.humidity;
    const emojiIcon = iconsMapping[dataCity.weather[0].icon];


    const timeSunrise = dataCity.sys.sunrise;
    const sunriseShow = new Date(timeSunrise * 1000);
    const hourSunrise = sunriseShow.getHours();
    const minuteSunrise = sunriseShow.getMinutes();


    const timeSunset = dataCity.sys.sunset;
    const sunsetShow = new Date(timeSunset * 1000);
    const hourSunset = sunsetShow.getHours();
    const minuteSunset = sunsetShow.getMinutes();


    city.innerText = search.value;
    if ((valueDes == "clear sky") && (dataCity.weather[0].icon == '01d')) {
        valueDes = 'sunny';
    }
    description.innerText = valueDes;
    temp.innerText = `${valueTemp}°C`;
    feelsLike.innerText = `Feels like: ${valueFeels}°C`;
    humidity.innerText = `Humidity: ${valueHumidity}%`;
    sunrise.innerText = `Sunrise: ${hourSunrise}:${minuteSunrise} AM`;
    sunset.innerText = `Sunset: ${hourSunset}:${minuteSunset} PM`;
    icon.innerText = emojiIcon;
    containerWeather.style.display = 'block';
    containerWeather.style.display = 'flex';
}

function isHebrew() {
    const text = search.value;
    const hebrewRangeStart = 0x5d0;
    const hebrewRangeEnd = 0x5ea;

    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);

        if (charCode >= hebrewRangeStart && charCode <= hebrewRangeEnd) {
            return true;
        }
    }
    return false;
}

function showDataHebrow(dataCity) {
    let valueDes = dataCity.weather[0].description;
    const valueTemp = Math.ceil((dataCity.main.temp) - 273.15);
    const valueFeels = Math.ceil((dataCity.main.feels_like) - 273.15);
    const valueHumidity = dataCity.main.humidity;
    const emojiIcon = iconsMapping[dataCity.weather[0].icon];


    const timeSunrise = dataCity.sys.sunrise;
    const sunriseShow = new Date(timeSunrise * 1000);
    const hourSunrise = sunriseShow.getHours();
    const minuteSunrise = sunriseShow.getMinutes();


    const timeSunset = dataCity.sys.sunset;
    const sunsetShow = new Date(timeSunset * 1000);
    const hourSunset = sunsetShow.getHours();
    const minuteSunset = sunsetShow.getMinutes();


    city.innerText = search.value;
    if ((valueDes == "clear sky") && (dataCity.weather[0].icon == '01d')) {
        valueDes = 'שמשי';
    }
    if ((valueDes == "clear sky") && (dataCity.weather[0].icon == '01n')) {
        valueDes = 'שמים נקיים';
    }
    if (valueDes == "few clouds") {
        valueDes = 'מעט מאוד עננים';
    }
    if (valueDes == "scattered clouds") {
        valueDes = 'עננים מפוזרים';
    }
    if (valueDes == "broken clouds") {
        valueDes = 'מעונן';
    }
    if (valueDes == "shower rain") {
        valueDes = 'טפטוף קל';
    }
    if (valueDes == "rain") {
        valueDes = 'גשום';
    }
    if (valueDes == "thunderstorm") {
        valueDes = 'סופת ברקים';
    }
    if (valueDes == "snow") {
        valueDes = 'שלג';
    }
    if (valueDes == "mist") {
        valueDes = 'ערפל';
    }
    description.innerText = valueDes;
    temp.innerText = `${valueTemp}°C`;
    feelsLike.innerText = `מרגיש כמו: ${valueFeels}°C`;
    humidity.innerText = `לחות: ${valueHumidity}%`;
    sunrise.innerText = `זריחה: ${hourSunrise}:${minuteSunrise} בבוקר`;
    sunset.innerText = `שקיעה: ${hourSunset}:${minuteSunset} בערב`;
    icon.innerText = emojiIcon;
    containerWeather.style.display = 'block';
    containerWeather.style.display = 'flex';
    containerWeather.style.direction = 'rtl'
}

