import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import moment from 'moment';

let styles;

export default class Clock extends React.Component {
  state = {
    time: moment().format('h:mm'),
    dayOfWeek: moment().format('ddd'),
    dayNumber: moment().format('D'),
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({
        time: moment().format('h:mm'),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { time, dayOfWeek, dayNumber } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>
          {time}
        </Text>
        <View style={styles.dateWrapper}>
          <Text style={styles.dateText}>
            {dayOfWeek}
          </Text>
          <Text style={styles.dateText}>
            {dayNumber}
          </Text>
        </View>
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  timeText: {
    color: 'white',
    fontSize: 150,
    fontWeight: 'bold',
  },
  dateText: {
    color: 'black',
    fontSize: 70,
    fontWeight: 'bold',
  },
  dateWrapper: {
    backgroundColor: 'white',
    height: 180,
    width: 180,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
  },
});
