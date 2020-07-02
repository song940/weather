import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/Header';

import openweathermap from '../apis/openweathermap';

import './main.css';

const api = openweathermap({
  appid: 'f59d0e42623911baec74ffbda1a8c7e7'
});

const Today = ({ weather }) => {
  const { main, visibility } = weather || {};
  const { temp, feels_like, humidity, pressure } = main || {};
  return (
    <div className="today" >
      <h2 className="temp" >{temp}</h2>
      <ul className="today-detail" >
        <li>
          <span>{feels_like}</span>
          <span>feels_like</span>
        </li>
        <li>
          <span>{humidity}%</span>
          <span>humidity</span>
        </li>
        <li>
          <span>{pressure}hpa</span>
          <span>pressure</span>
        </li>
        <li>
          <span>{visibility}</span>
          <span>visibility</span>
        </li>
      </ul>
    </div>
  );
};

const WeatherItem = ({ weather: data }) => {
  const { main, weather, dt_txt } = data;
  const [date, time] = dt_txt.split(' ');
  return (
    <div className="weather-item" >
      <div>{weather.map(x => x.main).join('/')}</div>
      <span>{main.temp}</span>
      <div>{time}</div>
    </div>
  );
};

const App = () => {
  const [current, setCurrentWeather] = useState({});
  const [list, setForecast] = useState([]);
  useEffect(() => {
    Promise
      .resolve()
      .then(() => api.current('beijing'))
      .then(setCurrentWeather)
      .then(() => api.forecast('beijing'))
      .then(({ list }) => list.reduce((obj, x) => {
        const [date, time] = x.dt_txt.split(' ');
        obj[date] = obj[date] || [];
        obj[date].push(x);
        return obj;
      }, {}))
      .then(res => Object.keys(res).map(date => {
        return { date, list: res[date] };
      }))
      .then(setForecast)
  }, []);
  const { name } = current;
  console.log(list);
  return (
    <>
      <Header city={name} />
      <Today weather={current} />
      <ul className="forecast" >
        {list.map(weather => (
          <li>
            <span>{weather.date}</span>
            {
              weather.list.map(x => <WeatherItem weather={x} />)
            }
          </li>
        ))}
      </ul>
    </>
  );
};

ReactDOM.render(<App />,
  document.getElementById('app'));
