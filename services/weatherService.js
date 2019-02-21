import axios from 'axios';
import keys from '../keys';
import DataCache from './dataCache';

async function getWeatherData() {
  const { darkSkyApiKey } = keys;
  let weatherInfo;

  try {
    const {
      data: {
        currently: {
          icon: weatherType, apparentTemperature: feelsLike, temperature, summary,
        },
      },
    } = await axios.get(`https://api.darksky.net/forecast/${darkSkyApiKey}/41.9311667,-87.703772`, {
      params: {
        exclude: 'minutely,hourly,daily,alerts,flags',
      },
      timeout: 3000,
    });

    weatherInfo = {
      weatherType,
      summary,
      feelsLike: Math.round(feelsLike),
      temperature: Math.round(temperature),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving weather info:', e && e.message);

    weatherInfo = {
      hasError: true,
    };
  }

  return weatherInfo;
}

export default new DataCache(getWeatherData, 10);
