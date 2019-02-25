import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { dailyQuoteService } from '../../services';

let styles;

export default class DailyQuote extends React.Component {
  state = {};

  async componentWillMount() {
    const quoteInfo = await dailyQuoteService.getData();
    this.setState({ ...quoteInfo });
  }

  render() {
    const {
      quote, author, hasError,
    } = this.state;

    if (!hasError && Object.keys(this.state).length) {
      return (
        <View style={styles.container}>
          <Text style={styles.quote}>
            {quote}
          </Text>
          <Text style={styles.author}>
            &ndash;
            {' '}
            {author}
          </Text>
        </View>
      );
    }

    return null;
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  quote: {
    ...textStyles,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  author: {
    ...textStyles,
  },
});
