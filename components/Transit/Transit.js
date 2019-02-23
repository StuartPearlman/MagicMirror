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
  }) => {
    if (!hasError) {
      return (
        <React.Fragment>
          <View style={styles.column}>
            <MaterialCommunityIcons name={isBus ? 'bus' : 'train'} size={128} color="white" />
            <Text style={styles.whiteText}>
              {title}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.whiteText}>
              {subtitle}
            </Text>
            {arrivalTimes.map((time, index) => (
              // This is okay because arrivalTimes is never mutated
              // eslint-disable-next-line react/no-array-index-key
              <Text style={styles.whiteText} key={index}>
                {time}
              </Text>
            ))}
            {!arrivalTimes.length && (
              <Text style={styles.whiteText}>
                No scheduled arrivals.
              </Text>
            )}
          </View>
        </React.Fragment>
      );
    }

    return null;
  };

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
    alignContent: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1.5,
    width: '100%',
  },
  whiteText: {
    ...textStyles,
  },
  column: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    width: '50%',
  },
});
