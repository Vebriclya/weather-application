import './styles.css';
import { format } from 'date-fns';

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

// FUNCTIONS

function addDiv(className, appendThis) {
  const sectionName = document.createElement('div');
  sectionName.className = className;
  appendThis.appendChild(sectionName);

  return sectionName;
}

function generateWeatherSection(id, appendThis) {
  const weatherSection = addDiv('weather-section', appendThis);
  weatherSection.setAttribute('id', id);

  const dayAndMoonphase = addDiv('day-and-moonphase', weatherSection);
  addDiv('day', dayAndMoonphase);
  addDiv('moon-phase', dayAndMoonphase);

  const weatherBox = addDiv('weather-box', weatherSection);
  const temperature = addDiv('temperature', weatherBox);
  addDiv('temp-text', temperature);
  addDiv('temp-format', temperature);
  addDiv('vl', weatherBox);
  const details = addDiv('details', weatherBox);
  addDiv('condition', details);
  addDiv('humidity', details);
  addDiv('rain', details);
  addDiv('snow', details);
  addDiv('winds', details);

  appendThis.appendChild(weatherSection);
  return weatherSection;
}

function fetchLocation(location) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=5a27d69e27f140f58e7141821230211&q=${location}&days=3`;

  fetch(apiUrl)
    .then((response) => {
      const weatherSections = document.querySelectorAll('.weather-section');

      if (!response.ok) {
        // do something
        const locationDiv = document.querySelector('.location-div');
        locationDiv.textContent = 'Location not found';
        weatherSections.forEach((section) => {
          section.style.display = 'none';
        });
        throw new Error('Location not found');
      } else {
        weatherSections.forEach((section) => {
          section.style.display = '';
        });
      }

      return response.json();
    })
    .then((response) => {
      // SETTING THE HEADER TEXT AND SELECTING THE SEARCHBOX
      const { forecast } = response;
      const location = `${response.location.name.toUpperCase()}, ${response.location.country.toUpperCase()}`;
      const forecastDayArray = forecast.forecastday;
      const locationDiv = document.querySelector('.location-div');
      locationDiv.innerText = location;

      // INITIAL POPULATION OF WEATHER
      forecastDayArray.forEach((day, index) => {
        const date = new Date(day.date);
        const formattedDate = format(date, 'eeee');
        const moonPhase = day.astro.moon_phase;
        const averageTemp = day.day.avgtemp_c;
        const condition = day.day.condition.text;
        const humidity = day.day.avghumidity;
        const rainChance = day.day.daily_chance_of_rain;
        const snowChance = day.day.daily_chance_of_snow;
        const windspeed = day.day.maxwind_mph;

        const dayDiv = document.getElementById(`day-${index + 1}`);
        dayDiv.querySelector('.day').textContent = formattedDate;
        dayDiv.querySelector('.moon-phase').textContent = moonPhase;
        dayDiv.querySelector('.temp-text').textContent = averageTemp;
        dayDiv.querySelector('.temp-format').textContent = '°C';
        dayDiv.querySelector('.condition').textContent = condition;
        dayDiv.querySelector('.humidity').textContent = `Humidity: ${humidity}%`;
        if (rainChance > 50) {
          dayDiv.querySelector('.rain').textContent = `${rainChance}% chance of rain`;
        }
        if (snowChance > 50) {
          dayDiv.querySelector('.snow').textContent = `${snowChance}% chance of snow`;
        }
        if (windspeed > 30) {
          dayDiv.querySelector('.winds').textContent = `High winds of ${windspeed}mph possible`;
        }
      });
    });
}

function updateLocation(newLocation) {
  fetchLocation(newLocation);
}

function component() {
  const windowDiv = document.createElement('div');
  windowDiv.className = 'window-div';

  const header = addDiv('header', windowDiv);
  const locationDiv = addDiv('location-div', header);
  const searchBox = document.createElement('input');
  searchBox.setAttribute('class', 'search');
  searchBox.placeholder = 'Search city';
  header.appendChild(searchBox);

  for (let index = 1; index < 4; index++) {
    generateWeatherSection((`day-${index}`), windowDiv);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const searchBoxEntry = document.querySelector('.search');

    searchBoxEntry.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const newLocation = searchBoxEntry.value.toLowerCase();

        updateLocation(newLocation);
      }
    });

    fetchLocation('felixstowe');
  });

  return windowDiv;
}

document.body.appendChild(component());
