import axios from 'axios';
import DataCache from './dataCache';

async function getQuoteData() {
  let quoteInfo;

  try {
    const {
      data: {
        thought: {
          quote,
          thoughtAuthor: {
            name: author,
          },
        },
      },
    } = await axios.get('https://www.forbes.com/forbesapi/thought/uri.json', {
      params: {
        query: 1,
      },
      timeout: 1000,
    });

    quoteInfo = {
      quote: quote.trim(),
      author,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving quote info:', e && e.message);

    quoteInfo = {
      hasError: true,
    };
  }

  return quoteInfo;
}

export default new DataCache(getQuoteData, 60);
