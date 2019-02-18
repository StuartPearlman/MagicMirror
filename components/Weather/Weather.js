import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import WeatherIcon from './WeatherIcon';
import { getWeather } from '../../services';

let styles;

export default class Weather extends React.Component {
  state = {
    weatherType: 'snow',
    summary: 'Light Snow',
    feelsLike: '18',
    temperature: '25',
  };

  async componentWillMount() {
    const weather = await getWeather();
    this.setState({ ...weather });
  }

  render() {
    const {
      weatherType, summary, feelsLike, temperature,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <WeatherIcon weatherType={weatherType} />
          <Text style={styles.subHeading}>
            {summary}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.temperature}>
            {temperature}
            &#176;
          </Text>
          <View style={styles.feelsLikeWrapper}>
            <Text style={styles.feelsLike}>
              Feels Like:&nbsp;
            </Text>
            <Text style={styles.subHeading}>
              {feelsLike}
              &#176;
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const textStyles = {
  color: 'white',
  fontSize: 30,
  fontWeight: 'bold',
  textAlign: 'center',
};

styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  temperature: {
    ...textStyles,
    fontSize: 120,
    lineHeight: 120,
  },
  feelsLike: {
    ...textStyles,
    fontStyle: 'italic',
  },
  subHeading: {
    ...textStyles,
  },
  feelsLikeWrapper: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
