
export const openweathermap = ({ appid, units = 'metric' } = {}) => {
  const api = `https://api.openweathermap.org/data/2.5`;
  return {
    /**
     * https://openweathermap.org/current
     * @param {*} q 
     */
    current(q) {
      return Promise
        .resolve()
        .then(() => fetch(api + `/weather?q=${q}&appid=${appid}&units=${units}`))
        .then(res => res.json())
    },
    forecast(q) {
      return Promise
        .resolve()
        .then(() => fetch(api + `/forecast?q=${q}&appid=${appid}&units=${units}`))
        .then(res => res.json())
    },
    forecast_daily(q) {
      const base = api + `/forecast`;
      return Promise
        .resolve()
        .then(() => fetch(base + `/daily?q=${q}&appid=${appid}`))
        .then(res => res.json())
    },
  };
};