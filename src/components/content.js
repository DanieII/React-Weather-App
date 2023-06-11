import { useEffect, useRef } from "react";
import sunClouds from '../assets/sun-clouds.gif'


const Content = ({ weatherData }) => {
    const contentRef = useRef();
    console.log(weatherData);

    if (contentRef.current) {
        if (weatherData) {
            contentRef.current.classList.add("active");
        } else {
            contentRef.current.classList.remove("active");
        }
    }

    const kelvinToCelsius = (kelvin) => {
        return (kelvin - 273.15).toFixed(1);
    }

    return (
        <div id="content" ref={contentRef}>
            <img src={sunClouds} className="gif"></img>
            {weatherData ? (
                <>
                    <div id="information">
                        <h1>{kelvinToCelsius(weatherData.temp)}&deg;</h1>
                        <h2>Feels like {kelvinToCelsius(weatherData.feels_like)}&deg;</h2>
                        <p><strong>{weatherData.weather}</strong></p>
                        <p><strong></strong></p>
                    </div>
                </>
            ) : <></>}
        </div>
    )
}

export default Content;