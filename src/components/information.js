import { useEffect, useRef } from "react";
import clouds from '../assets/clouds.gif';
import sun from '../assets/sun.gif';
import rain from '../assets/rain.gif';
import wind from '../assets/wind.gif'


const weatherImages = [
    { image: clouds, name: "clouds" },
    { image: sun, name: "sun" },
    { image: rain, name: "rain" },
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

    const getForecastDays = (weatherInformation) => {
        let dates = new Set();
        for (const current in weatherInformation) {
            const information = weatherInformation[current];
            const date = information.dt_txt;
            dates.add(date.match(datePattern)[0])
        }
        const days = Array.from(dates).map((day) => new Date(day).toDateString().split(' ')[0]);
        return days;
    }


    let currentImage;
    if (informationRef.current) {
        if (weatherData) {
            getForecastDays(weatherData.forecastWeather.list);
            const currentImageObj = findImageByWeather(weatherData.currentWeather.weather);
            if (!currentImageObj) {
                currentImage = findImageByWeather(BACKUP_WEATHER).image;
            } else {
                currentImage = currentImageObj.image;
            }
            informationRef.current.classList.add("active");
        } else {
            informationRef.current.classList.remove("active");
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
                    <div id="forecast-weather">

                    </div>
                </>
            ) : <></>}
        </div>
    )
}

export default Information;