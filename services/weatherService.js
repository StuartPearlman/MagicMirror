import keys from '../keys';

export default async function getWeather() {
  const { darkSkyApiKey } = keys;
  let weatherInfo;

  try {
    const response = await fetch(`https://api.darksky.net/forecast/${darkSkyApiKey}/41.9311509,-87.7038042?exclude=minutely,hourly,daily,alerts,flags`);
    const {
      currently: {
        icon: weatherType, apparentTemperature: feelsLike, temperature, summary,
      },
    } = await response.json();

    weatherInfo = {
      weatherType,
      summary,
      feelsLike: Math.round(feelsLike),
      temperature: Math.round(temperature),
    };
  } catch (e) {
    weatherInfo = {};
  }

  return weatherInfo;
}
