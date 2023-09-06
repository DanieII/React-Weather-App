import "./index.css";
import Search from "./components/search";
import Weather from "./components/weather";
import ThemeButton from "./components/theme-button";
import { useEffect, useState, useRef } from "react";

function App() {
  const [city, setCity] = useState();
  const [weatherData, setWeatherData] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const errorRef = useRef();

  const onSearch = (currentCity) => {
    setCity(currentCity);
  };

  const getCoordinatesFromCityName = async () => {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`,
    );

    const data = await response.json();

    if (data.length > 0) {
      const [lat, lon] = [data[0]["lat"], data[0]["lon"]];
      return [lat, lon];
    } else {
      setErrorMessage(`${city} is not a valid city`);
    }
  };

  const getCurrentWeather = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    );
    const data = await response.json();

    return {
      city: city,
      weather: data["weather"][0]["main"],
      temp: data["main"]["temp"],
      feels_like: data["main"]["feels_like"],
    };
  };

  const getWeatherForecast = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    );
    const data = await response.json();
    return data;
  };

  const getWeatherData = async () => {
    const result = await getCoordinatesFromCityName();

    if (result) {
      const [lat, lon] = result;
      const data = {
        currentWeather: await getCurrentWeather(lat, lon),
        forecastWeather: await getWeatherForecast(lat, lon),
      };
      return data;
    }
  };

  useEffect(() => {
    if (city) {
      async function setNewWeatherData() {
        const newWeatherData = await getWeatherData();
        if (newWeatherData) {
          setWeatherData(newWeatherData);
        } else {
          setWeatherData(null);
        }
      }
      setNewWeatherData();
    }
  }, [city]);

  useEffect(() => {
    errorRef.current?.classList.remove("hidden");
    const errorTimeout = setTimeout(() => {
      errorRef.current?.classList.add("hidden");
    }, 2000);

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [errorMessage]);

  return (
    <div className="App h-screen flex flex-col items-center justify-center bg-antiquewhite dark:bg-black-bg">
      <ThemeButton />
      {errorMessage ? (
        <div className="dark:text-white m-10" ref={errorRef}>
          {errorMessage}
        </div>
      ) : (
        <></>
      )}

      <div className="md:w-1/3 sm:w-full">
        <Search onSearch={onSearch} />
        <Weather weatherData={weatherData} />
      </div>
    </div>
  );
}

export default App;
