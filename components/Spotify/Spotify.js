import React from 'react';
import {
  StyleSheet, Text, View, ProgressBarAndroid,
} from 'react-native';
import { Icon } from 'expo';
import moment from 'moment';
import { spotifyService } from '../../services';
import DailyQuote from '../DailyQuote/DailyQuote';

const { MaterialCommunityIcons } = Icon;

let styles;

export default class Spotify extends React.Component {
  state = {};

  async componentWillMount() {
    this.updateTrackInfo();
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.updateTrackInfo();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  async updateTrackInfo() {
    const currentlyPlaying = await spotifyService.retrieveCurrentlyPlaying();
    const { songDuration, songProgress } = currentlyPlaying;

    this.setState({
      ...currentlyPlaying,
      currentTrackTime: songProgress && moment.utc(songProgress).format('m:ss'),
      trackEndTime: songDuration && moment.utc(songDuration).format('m:ss'),
    });
  }

  render() {
    const {
      title, songDuration, songProgress, artist,
      currentTrackTime, trackEndTime, hasError, isPlaying,
    } = this.state;

    if (!hasError && Object.keys(this.state).length && isPlaying) {
      return (
        <View style={styles.container}>
          <MaterialCommunityIcons name="spotify" size={128} color="white" />
          <View style={styles.trackInfo}>
            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.artist}>
              {artist}
            </Text>
            <View style={styles.trackTime}>
              <Text style={styles.time}>
                {currentTrackTime}
              </Text>
              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={songProgress / songDuration}
                color="white"
                style={styles.progressBar}
              />
              <Text style={styles.time}>
                {trackEndTime}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return <DailyQuote />;
  }
}

const textStyles = {
  color: 'white',
  fontSize: 25,
  fontWeight: 'bold',
  textAlign: 'center',
};

styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  trackInfo: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
  },
  trackTime: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  progressBar: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    ...textStyles,
    fontStyle: 'italic',
  },
  artist: {
    ...textStyles,
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  time: {
    ...textStyles,
    fontSize: 20,
  },
});
