import { useEffect, useRef, useState } from "react";
import clouds from "../assets/clouds.gif";
import sun from "../assets/sun.gif";
import rain from "../assets/rain.gif";
import wind from "../assets/wind.gif";

const weatherImages = [
  { image: clouds, name: "clouds" },
  { image: sun, name: "sun" },
  { image: rain, name: "rain" },
  { image: rain, name: "storm" },
  { image: wind, name: "wind" },
];

const BACKUP_WEATHER = "sun";

const Weather = ({ weatherData }) => {
  const [forecast, setForecast] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const weatherRef = useRef();
  const weatherTransitionDuration = 500;
  let isActive = false;

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };
  const findImageByWeather = (weather) => {
    const imageObj = weatherImages.find((weatherImage) =>
      weather.toLowerCase().includes(weatherImage.name),
    );
    return imageObj;
  };

  const getImageByWeather = (weather) => {
    const imageObj = findImageByWeather(weather);
    let image;
    if (!imageObj) {
      image = findImageByWeather(BACKUP_WEATHER).image;
    } else {
      image = imageObj.image;
    }
    return image;
  };

  const getForecastDay = (currentWeatherInformation) => {
    const date = currentWeatherInformation.dt_txt;
    const day = new Date(date).toDateString().split(" ")[0];
    return day;
  };

  const getDayAverageTemperature = (allTemperatures) => {
    let sum = 0;
    for (const temperature of allTemperatures) {
      sum += Number(temperature);
    }
    return (sum / allTemperatures.length).toFixed(1);
  };

  const getDayMostRepeatedWeather = (allWeather) => {
    let trackWeather = {};
    for (const weather of allWeather) {
      if (!(weather in trackWeather)) {
        trackWeather[weather] = 0;
      }
      trackWeather[weather] += 1;
    }
    let mostRepeated;
    for (const weather in trackWeather) {
      if (!mostRepeated) {
        mostRepeated = weather;
      } else {
        if (trackWeather[mostRepeated] < trackWeather[weather]) {
          mostRepeated = weather;
        }
      }
    }
    return mostRepeated;
  };

  const getForecastDaysWeather = (weatherInformation) => {
    let days = new Set();
    let daysWeather = [];

    for (const current in weatherInformation) {
      const information = weatherInformation[current];
      const day = getForecastDay(information);
      const temp = kelvinToCelsius(information.main.temp);
      const weather = information.weather["0"].main;
      const addedDays = daysWeather.map((dayWeather) => dayWeather.day);
      days.add(day);

      if (!addedDays.includes(day)) {
        const dayWeather = {
          day: day,
          temperature: [],
          weather: [],
          image: null,
        };
        daysWeather.push(dayWeather);
      }

      const currentDayWeather = daysWeather.filter(
        (dayWeather) => dayWeather.day === day,
      )[0];
      currentDayWeather.temperature.push(temp);
      currentDayWeather.weather.push(weather);
    }

    for (const day of daysWeather) {
      day.temperature = getDayAverageTemperature(day.temperature);
      day.weather = getDayMostRepeatedWeather(day.weather);
      day.image = getImageByWeather(day.weather);
    }
    const nextFiveDays = daysWeather.slice(1);

    return nextFiveDays;
  };

  async function startAnimation() {
    weatherRef.current.classList.add("collapsed");
    await new Promise((resolve) => {
      setTimeout(
        () => {
          weatherRef.current.classList.remove("collapsed");
          resolve();
        },
        isActive ? weatherTransitionDuration : 0,
      );
    });
  }

  useEffect(() => {
    if (weatherData) {
      isActive = true;
      const setWeather = async () => {
        await startAnimation();
        setForecast(getForecastDaysWeather(weatherData.forecastWeather.list));
        setCurrentImage(getImageByWeather(weatherData.currentWeather.weather));
      };
      setWeather();
    } else {
      isActive = false;
    }
  }, [weatherData]);

  return (
    <div
      ref={weatherRef}
      className="flex flex-col content-center items-center overflow-hidden weather collapsed transition-all ease-linear duration-{weatherTransitionDuration}"
    >
      {weatherData ? (
        <>
          <img src={currentImage} className="w-2/3"></img>
          <div className="text-center m-5">
            <h1 className="dark:text-white">
              {kelvinToCelsius(weatherData.currentWeather.temp)}&deg;
            </h1>
            <p className="dark:text-white">
              {weatherData.currentWeather.weather}
            </p>
          </div>
          <ul className="flex gap-5 gap-2 text-center">
            {forecast.map((day, index) => {
              return (
                <li key={index} className="flex flex-col self-baseline ">
                  <p key={day.day} className="dark:text-white">
                    {day.day}
                  </p>
                  <img key={day.image} src={day.image} className="w-10 h-10 " />
                  <p key={day.temperature} className="dark:text-white">
                    {day.temperature}&deg;
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
