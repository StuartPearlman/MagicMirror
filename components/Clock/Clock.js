import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import moment from 'moment';

let styles;

export default class Clock extends React.Component {
  state = {
    time: moment().format('LTS'),
    date: moment().format('dddd, MMMM Do YYYY'),
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({
        time: moment().format('LTS'),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { time, date } = this.state;

    return (
      <View>
        <Text style={styles.timeText}>
          {time}
        </Text>
        <Text style={styles.dateText}>
          {date}
        </Text>
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 40,
  },
  dateText: {
    color: 'white',
    fontSize: 40,
  },
});
