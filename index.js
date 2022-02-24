import { ready } from 'https://lsong.org/scripts/dom.js';
import { h, render, useState, useEffect } from 'https://lsong.org/scripts/components/index.js';
import { openweathermap } from './openweathermap.js';

const appid = 'f59d0e42623911baec74ffbda1a8c7e7';
const api = openweathermap({ appid });

const WeatherItem = ({ weather: data }) => {
  console.log(data);
  const { main, visibility, weather, wind, dt_txt = 'Now' } = data || {};
  const { temp, temp_min, temp_max, feels_like, humidity, pressure } = main;
  const [w1] = weather;
  const icon = `http://openweathermap.org/img/w/${w1.icon}.png`;
  return h('div', { className: "weather-item" }, [
    dt_txt && h('h3', null, dt_txt),
    h('div', { className: '' }, [
      h('img', { src: icon }),
      h('span', null, `${w1.description}`),
    ]),
    h('div', null, [
      h('h3', { className: "temp" }, `${temp}°C`),
      h('small', null, `${temp_min}°C ~ ${temp_max}°C`),
    ]),
    h('ul', { className: "today-detail" }, [
      h('li', null, [
        h('span', null, `Feels like: ${feels_like}°C`),
      ]),
      h('li', null, [
        h('span', null, `Humidity: ${humidity}%`),
      ]),
      h('li', null, [
        h('span', null, `Pressure: ${pressure}hPa`),
      ]),
      h('li', null, [
        h('span', null, `Visibility: ${visibility}m`),
      ]),
      h('li', {}, [
        h('span', null, `Wind: ${wind.speed}`),
        h('small', null, `m/s`),
        h('b', { className: 'inline-block', style: `transform: rotate(${wind.deg}deg);` }, `↑`),
        wind.gust && h('span', null, wind.gust),

      ]),
    ]),
  ]);
};

const groupByDay = (list = []) => {
  return list.reduce((group, item) => {
    const { dt_txt } = item;
    const [d, t] = dt_txt.split(/\s/);
    group[d] = group[d] || [];
    group[d].push({ ...item, dt_txt: t });
    return group;
  }, {});
}

const WeatherDay = ({ date, items }) => {
  return h('div', { className: "weather-day" }, [
    h('h2', null, date),
    h('div', { className: 'weather-day-items' }, items.map(item => h(WeatherItem, { weather: item })))
  ]);
}

const App = () => {
  const [city, setCity] = useState('beijing');
  const [current, setCurrentWeather] = useState();
  const [forecast, setForecastWeather] = useState();
  const handleChange = (e) => {
    const { value: city } = e.target;
    setCity(city);
  };
  useEffect(() => {
    api.current(city).then(setCurrentWeather);
    api.forecast(city).then(setForecastWeather);
  }, [city]);
  const { name = 'Weather' } = current || {};
  const { city: { country, coord } = {}, list } = forecast || {};
  const group = groupByDay(list);
  return [
    h('h2', null, [
      h(coord ? 'a' : 'span', { href: coord && `https://www.openstreetmap.org/#map=18/${coord.lat}/${coord.lon}` }, name),
      country && h('small', {}, `(${country})`),
    ]),
    h('select', { onChange: handleChange }, [
      h('option', { value: 'beijing' }, 'Beijing'),
      h('option', { value: 'shanghai' }, 'Shanghai'),
      h('option', { value: 'tokyo' }, 'Tokyo'),
    ]),
    current && h(WeatherItem, { weather: current }),
    forecast && h('div', { className: 'forecast' }, [
      Object.entries(group).map(([date, items]) => h(WeatherDay, { date, items })),
    ]),
  ]
};

ready(() => {
  const app = document.getElementById('app');
  render(h(App), app);
});
