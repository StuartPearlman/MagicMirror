import React from 'react';
import { Font, Icon } from 'expo';
import momentTimezone from 'moment-timezone';
import { Dashboard } from './components';
import {
  weatherService, transitService, dailyQuoteService, spotifyService,
} from './services';

const { Feather, MaterialCommunityIcons, Ionicons } = Icon;

export default class App extends React.Component {
  state = { fontLoaded: false };

  async componentWillMount() {
    momentTimezone.tz.setDefault('America/Chicago');

    await Promise.all([
      Font.loadAsync(Feather.font),
      Font.loadAsync(MaterialCommunityIcons.font),
      Font.loadAsync(Ionicons.font),
    ]);

    this.setState({ fontLoaded: true });

    // Warm up cache
    await Promise.all([
      weatherService.getData(),
      transitService.getData(),
      dailyQuoteService.getData(),
      spotifyService.retrieveCurrentlyPlaying(),
    ]);
  }

  render() {
    const { fontLoaded } = this.state;

    if (fontLoaded) {
      return (
        <Dashboard />
      );
    }

    return null;
  }
}
