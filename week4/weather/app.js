var cityInput = document.getElementById('cityInput');
var searchButton = document.getElementById('btn');
var weatherInfoDiv = document.getElementById('weather-info');

searchButton.addEventListener('click', function () {
  var city = cityInput.value.trim();
  console.log(city);
  if (city === '') {
    alert('Error: City name cannot be empty!');
  } else {
    var ourRequest = new XMLHttpRequest();

    ourRequest.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2e0bb3b26408a54823e7ddf16932990f`);
    ourRequest.onload = function () {
      if (ourRequest.status >= 200 && ourRequest.status < 400) {
        var data = JSON.parse(ourRequest.responseText);
        const weatherInfo = "<p>The weather in " + data.name + " is " + data.weather[0].description + ".<br>The temperature is " + data.main.temp + "with a wind speed of " + data.wind.speed + "m/s.</p>";

        weatherInfoDiv.insertAdjacentHTML('beforeend',weatherInfo);
      } else {
        var httpStatusError = "<p>HTTP Status Code Error</p>";
        weatherInfoDiv.insertAdjacentHTML('beforeend',httpStatusError);
      }
    };

    ourRequest.onerror = function () {
      var networkError = "<p>Network Error</p>";
      weatherInfoDiv.insertAdjacentHTML('beforeend',networkError);

    };

    ourRequest.send();
  }
});