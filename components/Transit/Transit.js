import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { Icon } from 'expo';
import { transitService } from '../../services';

const { MaterialCommunityIcons } = Icon;

let styles;

export default class Transit extends React.Component {
  state = {};

  async componentWillMount() {
    const transitInfo = await transitService.getData();
    this.setState({ ...transitInfo });
  }

  getTransitTimesMarkup = ({
    title, subtitle, arrivalTimes = [], hasError, isBus,
  }) => (
    <View style={styles.column}>
      <MaterialCommunityIcons name={isBus ? 'bus' : 'train'} size={128} color="white" />
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
      <View style={styles.horizontalRule} />
      {arrivalTimes.map((time, index) => (
        // This is okay because arrivalTimes is never mutated
        // eslint-disable-next-line react/no-array-index-key
        <Text style={styles.arrivalTimes} key={index}>
          {time}
          {' '}
          min
        </Text>
      ))}
      {!arrivalTimes.length && !hasError && (
        <Text style={styles.noArrivals}>
          No scheduled arrivals
        </Text>
      )}
      {hasError && (
        <Text style={styles.noArrivals}>
          No data available
        </Text>
      )}
    </View>
  );

  render() {
    const { busesData = {}, trainsData = {} } = this.state;
    const isNoDataAvailable = busesData.hasError && trainsData.hasError;

    if (!isNoDataAvailable && Object.keys(this.state).length) {
      return (
        <View style={styles.container}>
          {this.getTransitTimesMarkup({ ...busesData, isBus: true })}
          {this.getTransitTimesMarkup(trainsData)}
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

styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  column: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    ...textStyles,
  },
  subtitle: {
    ...textStyles,
    fontSize: 20,
  },
  horizontalRule: {
    width: '50%',
    borderWidth: 1,
    borderColor: 'white',
    margin: 5,
  },
  arrivalTimes: {
    ...textStyles,
  },
  noArrivals: {
    ...textStyles,
  },
});
