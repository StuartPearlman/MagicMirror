import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import WeatherIcon from './WeatherIcon';
import { weatherService } from '../../services';

let styles;

export default class Weather extends React.Component {
  state = {};

  async componentWillMount() {
    const weather = await weatherService.getData();
    this.setState({ ...weather });
  }

  render() {
    const {
      weatherType, summary, feelsLike, temperature, hasError,
    } = this.state;

    if (!hasError && Object.keys(this.state).length) {
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

    return null;
  }
}

const textStyles = {
  color: 'white',
  fontSize: 30,
  fontWeight: 'bold',
  textAlign: 'center',
};

const centeredRow = {
  justifyContent: 'space-around',
  alignItems: 'center',
  flexDirection: 'row',
};

styles = StyleSheet.create({
  container: {
    ...centeredRow,
    flex: 1,
    width: '100%',
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
    ...centeredRow,
  },
  infoBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
