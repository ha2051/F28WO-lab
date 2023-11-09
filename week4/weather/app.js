
https://api.openweathermap.org/data/2.5/weather?q=${city}&appid= 2e0bb3b26408a54823e7ddf16932990f
const inputField = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherInfoDiv = document.getElementById('weatherInfo');

searchButton.addEventListener('click', () => {
  const cityName = inputField.value.trim();

  if (cityName === '') {
    alert('Please enter a city name');
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const weatherDescription = data.weather[0].description;
      const mainTemperature = data.main.temp;
      const windSpeed = data.wind.speed;

      weatherInfoDiv.innerHTML = `
        <p>Weather: ${weatherDescription}</p>
        <p>Main Temperature: ${mainTemperature} K</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        alert('Request aborted');
      } else if (error.name === 'TypeError') {
        alert('Network error. Please check your internet connection');
      } else {
        alert('An error occurred. Please try again later');
      }
    });
});
