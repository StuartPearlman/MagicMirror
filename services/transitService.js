import axios from 'axios';
import moment from 'moment';
import keys from '../keys';
import DataCache from './dataCache';

async function getBuses() {
  const { ctaBusApiKey } = keys;
  let busInfo;

  try {
    const { data: { 'bustime-response': { prd: predictions } } } = await axios.get('http://www.ctabustracker.com/bustime/api/v2/getpredictions', {
      params: {
        key: ctaBusApiKey,
        stpid: '11065',
        format: 'json',
      },
      timeout: 1500,
    });

    const arrivalTimes = predictions
      .filter(({ prdctdn }) => prdctdn !== 'DUE')
      .map(({ prdctdn }) => prdctdn);

    busInfo = {
      arrivalTimes: arrivalTimes.slice(0, 2),
      title: 'Route 76',
      subtitle: 'Diversey (W)',
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving bus info:', e && e.message);

    busInfo = {
      hasError: true,
    };
  }

  return busInfo;
}

async function getTrains() {
  const { ctaTrainApiKey } = keys;
  let trainInfo;

  try {
    const { data: { ctatt: { eta: predictions } } } = await axios.get('http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx', {
      params: {
        key: ctaTrainApiKey,
        stpid: '30198',
        outputType: 'JSON',
      },
      timeout: 1500,
    });

    const arrivalTimes = predictions.map(({ arrT: arrivalTime }) => moment(arrivalTime).diff(moment(), 'minutes'));

    trainInfo = {
      arrivalTimes: arrivalTimes.slice(0, 2),
      title: 'Blue Line',
      subtitle: 'Forest Park',
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving train info:', e && e.message);

    trainInfo = {
      hasError: true,
    };
  }

  return trainInfo;
}

async function getTransitData() {
  const [busesData, trainsData] = await axios.all([getBuses(), getTrains()]);

  return {
    busesData,
    trainsData,
  };
}

export default new DataCache(getTransitData, 1);
