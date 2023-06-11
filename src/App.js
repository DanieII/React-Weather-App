import "./App.css";
import Search from "./components/search";
import Content from "./components/content";
import { useEffect, useState } from "react";

function App() {
  const [city, changeCity] = useState();
  const [weatherData, changeWeatherData] = useState();
  const [errorMessage, changeErrorMessage] = useState();

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const onSearch = (currentCity) => {
    changeCity(currentCity);
  }

  const getCoordinatesFromCityName = async () => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    if (data.length > 0) {
      const [lat, lon] = [data[0]['lat'], data[0]['lon']];
      return [lat, lon];
    } else {
      changeErrorMessage(`${city} is not a valid city`);
    }
  }

  const getWeatherData = async () => {
    const result = await getCoordinatesFromCityName();
    if (result) {
      const [lat, lon] = result;
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const data = await response.json();;
      return { city: city, weather: data["weather"][0]["main"], temp: data["main"]["temp"], feels_like: data["main"]["feels_like"] };
    }
  }

  useEffect(() => {
    if (city) {
      async function setNewWeatherData() {
        const newWeatherData = await getWeatherData();
        if (newWeatherData) {
          changeWeatherData(newWeatherData);
        } else {
          changeWeatherData(null)
        }
      }
      setNewWeatherData();
    }
  }, [city])

  return (
    <div className="App">
      {errorMessage && <div className="error"> {errorMessage} </div>}
      <Search onSearch={onSearch} />
      <Content weatherData={weatherData} />
    </div>
  );
}

export default App;
