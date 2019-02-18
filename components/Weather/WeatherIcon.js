import React from 'react';
import { Icon } from 'expo';

const { Feather, MaterialCommunityIcons, Ionicons } = Icon;

const iconDefaults = {
  size: 128,
  color: 'white',
};

const iconMap = {
  rain: <Feather name="cloud-rain" {...iconDefaults} />,
  snow: <Feather name="cloud-snow" {...iconDefaults} />,
  sleet: <MaterialCommunityIcons name="weather-hail" {...iconDefaults} />,
  wind: <MaterialCommunityIcons name="weather-windy-variant" {...iconDefaults} />,
  fog: <MaterialCommunityIcons name="weather-fog" {...iconDefaults} />,
  cloudy: <Feather name="cloud" {...iconDefaults} />,
  'clear-day': <Feather name="sun" {...iconDefaults} />,
  'clear-night': <Feather name="moon" {...iconDefaults} />,
  'partly-cloudy-day': <Ionicons name="md-partly-sunny" {...iconDefaults} />,
  'partly-cloudy-night': <Ionicons name="md-cloudy-night" {...iconDefaults} />,
};

export default function WeatherIcon({ weatherType }) {
  return iconMap[weatherType] || null;
}
