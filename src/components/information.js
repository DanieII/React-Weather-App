import { useEffect, useRef } from "react";
import clouds from '../assets/clouds.gif';
import sun from '../assets/sun.gif';
import rain from '../assets/rain.gif';
import wind from '../assets/wind.gif'


const weatherImages = [
    { image: clouds, name: "clouds" },
    { image: sun, name: "sun" },
    { image: rain, name: "rain" },
    { image: rain, name: "storm" },
    { image: wind, name: "wind" }
];

const BACKUP_WEATHER = "sun"
const datePattern = /\d+-\d+-\d+/;

const Information = ({ weatherData }) => {
    const informationRef = useRef();

    const kelvinToCelsius = (kelvin) => {
        return (kelvin - 273.15).toFixed(1);
    }

    const findImageByWeather = (weather) => {
        const imageObj = weatherImages.find((weatherImage) => weather.toLowerCase().includes(weatherImage.name.toLowerCase()));
        return imageObj;
    }

    const getImageByWeather = (weather) => {
        const imageObj = findImageByWeather(weather);
        let image;
        if (!imageObj) {
            image = findImageByWeather(BACKUP_WEATHER).image;
        } else {
            image = imageObj.image;
        }
        return image;
    }

    const getForecastDay = (currentWeatherInformation) => {
        const date = currentWeatherInformation.dt_txt;
        const day = new Date(date).toDateString().split(" ")[0];
        return day;
    }


    const getDayAverageTemperature = (allTemperatures) => {
        let sum = 0;
        for (const temperature of allTemperatures) {
            sum += Number(temperature);
        }
        return (sum / allTemperatures.length).toFixed(1);
    }

    const getDayMostRepeatedWeather = (allWeather) => {
        let trackWeather = {};
        for (const weather of allWeather) {
            if (!(weather in trackWeather)) {
                trackWeather[weather] = 0
            }
            trackWeather[weather] += 1
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
    }

    const getForecastDaysWeather = (weatherInformation) => {
        let days = new Set();
        let daysWeather = {};
        for (const current in weatherInformation) {
            const information = weatherInformation[current];
            const day = getForecastDay(information);
            const temp = kelvinToCelsius(information.main.temp);
            const weather = information.weather["0"].main;
            days.add(day);
            if (!(day in daysWeather)) {
                daysWeather[day] = { temperature: [], weather: [], image: null };
            }
            daysWeather[day].temperature.push(temp);
            daysWeather[day].weather.push(weather);
        }
        for (const day in daysWeather) {
            const information = daysWeather[day];
            information.temperature = getDayAverageTemperature(information.temperature);
            information.weather = getDayMostRepeatedWeather(information.weather);
            information.image = getImageByWeather(information.weather);
        }
        return daysWeather;
    }


    let forecast;
    let currentImage;
    if (informationRef.current) {
        if (weatherData) {
            forecast = getForecastDaysWeather(weatherData.forecastWeather.list);
            currentImage = getImageByWeather(weatherData.currentWeather.weather);
            informationRef.current.classList.remove("active-after-animation");
            informationRef.current.classList.add("active");
            setTimeout(() => {
                informationRef.current.classList.add("active-after-animation");
            }, 250);

        } else {
            const fromInvalidToValid = informationRef.current.classList.contains("active") ? false : true;
            setTimeout(() => {
                informationRef.current.classList.remove("active");
                informationRef.current.classList.remove("active-after-animation");
            }, fromInvalidToValid ? 150 : 250);
        }
    }

    return (
        <div id="information" ref={informationRef}>
            {weatherData ? (
                <>
                    <img src={currentImage} className="gif"></img>
                    <div id="current-weather">
                        <h1>{kelvinToCelsius(weatherData.currentWeather.temp)}&deg;</h1>
                        <p><strong>{weatherData.currentWeather.weather}</strong></p>
                    </div>
                    <ul id="forecast-weather">
                        {Object.keys(forecast).map((day) => {
                            const currentDay = forecast[day];
                            return (
                                <li>
                                    <p key={currentDay.day}>{day}</p>
                                    <img key={currentDay.image} src={currentDay.image} className="gif" />
                                    <p key={currentDay.temperature}>{currentDay.temperature}&deg;</p>
                                </li>
                            );
                        })}
                    </ul>
                </>
            ) : <></>}
        </div>
    )
}

export default Information;