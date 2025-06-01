import React, { useEffect, useState } from 'react';
import '../App.css';

//Import Icons
import clearDayIcon from '../assets/icons/clear-day.svg';
import cloudyIcon from '../assets/icons/cloudy.svg';
import drizzleIcon from '../assets/icons/drizzle.svg';
import fogIcon from '../assets/icons/fog.svg';
import rainIcon from '../assets/icons/rain.svg';
import snowIcon from '../assets/icons/snow.svg';
import thunderIcon from '../assets/icons/thunderstorms.svg';

//Import Images
import searchingImg from '../assets/images/searching.png'
import notFoundImg from '../assets/images/not-found.png'

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;


const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(false);

  const getWeatherIcon = (id) => {
    if (id <= 232) return thunderIcon;
    if (id <= 321) return drizzleIcon;
    if (id <= 531) return rainIcon;
    if (id <= 622) return snowIcon;
    if (id <= 781) return fogIcon;
    if (id === 800) return clearDayIcon;
    return cloudyIcon;
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  const handleSearch = async () => {
    if (!city.trim()) return;
    try {
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
      const weather = await weatherRes.json();

      if (weather.cod !== 200) {
        setError(true);
        return;
      }

      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
      const forecast = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast.list.filter(item =>
        item.dt_txt.includes('12:00:00') &&
        !item.dt_txt.startsWith(new Date().toISOString().split('T')[0])
      ));
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setCity('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
    <a href="https://jadenm628.github.io/PortfolioProject/#projects" className='back-arrow'>← Back to Portfolio</a>
    <main className="main-container">
      <header className="input-container">
        <input
          className="city_input"
          type="text"
          placeholder="Search City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search_button" onClick={handleSearch}>
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      {error ? (
        <section className="not_found section-message">
          <img src={notFoundImg} alt="Not Found" />
          <div>
            <h1>City Not Found</h1>
            <h4 className="regular_text">Try another city name.</h4>
          </div>
        </section>
      ) : weatherData ? (
        <section className="weather_info">
          <div className="location_date_container">
            <div className="location">
              <span className="material-symbols-outlined">location_on</span>
              <h4 className="city_text">{weatherData.name} ,</h4>
              <h4 className="nation_text">{weatherData.sys.country}</h4>
            </div>
            <h5 className="current_date_text regular_text">{getCurrentDate()}</h5>
          </div>

          <div className="weather_summary_container">
            <img
              src={getWeatherIcon(weatherData.weather[0].id)}
              className="weather_summary_img"
              alt="Weather Icon"
            />
            <div className="weather_summary_info">
              <h1 className="temp_txt">{Math.round(weatherData.main.temp)} ℉</h1>
              <h3 className="condition_txt regular_text">{weatherData.weather[0].main}</h3>
              <h5 className="description_txt regular_text">{weatherData.weather[0].description}</h5>
            </div>
          </div>

          <div className="weather_conditions_container">
            <div className="conditions">
              <span className="material-symbols-outlined">water_drop</span>
              <div className="condition_info">
                <h5 className="regular_text">Humidity</h5>
                <h5 className="humidity_value_text">{weatherData.main.humidity}%</h5>
              </div>
            </div>
            <div className="conditions">
              <span className="material-symbols-outlined">air</span>
              <div className="condition_info">
                <h5 className="regular_text">Wind Speed</h5>
                <h5 className="wind_value_text">{weatherData.wind.speed} mph</h5>
              </div>
            </div>
          </div>

          <div className="forecast_items_container">
            {forecastData.map((item, idx) => {
              const date = new Date(item.dt_txt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
              });
              return (
                <div className="forecast_item" key={idx}>
                  <h5 className="forecast_item_date">{date}</h5>
                  <img src={getWeatherIcon(item.weather[0].id)} className="forecast-item-img" alt="Forecast Icon" />
                  <h5 className="forecast_item_temp">{Math.round(item.main.temp)} ℉</h5>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="search_city section-message">
          <img src={searchingImg} alt="Search City" />
          <div>
            <h2>Search City</h2>
            <h4 className="regular_text">Find out the weather conditions of the city</h4>
          </div>
        </section>
      )}
    </main>
    </>
  );
};

export default WeatherDashboard;
