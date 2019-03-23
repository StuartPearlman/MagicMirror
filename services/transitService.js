import axios from 'axios';
import moment from 'moment';
import keys from '../keys';
import DataCache from './dataCache';

async function getBuses() {
  const { ctaBusApiKey } = keys;
  const busInfo = {
    title: 'Route 76',
    subtitle: 'Diversey (W)',
  };

  try {
    const { data: { 'bustime-response': { prd: predictions = [] } } } = await axios.get('http://www.ctabustracker.com/bustime/api/v2/getpredictions', {
      params: {
        key: ctaBusApiKey,
        stpid: '11065',
        format: 'json',
      },
      timeout: 1500,
    });

    const arrivalTimes = predictions
      .filter(({ prdctdn }) => prdctdn !== 'DUE')
      .map(({ prdctdn }) => parseInt(prdctdn, 10));

    busInfo.arrivalTimes = arrivalTimes.slice(0, 2);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Error retrieving bus info:', e && e.message);

    busInfo.hasError = true;
  }

  return busInfo;
}

async function getTrains() {
  const { ctaTrainApiKey } = keys;
  const trainInfo = {
    title: 'Blue Line',
    subtitle: 'Forest Park',
  };

  try {
    const { data: { ctatt: { eta: predictions = [] } } } = await axios.get('http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx', {
      params: {
        key: ctaTrainApiKey,
        stpid: '30198',
        outputType: 'JSON',
      },
      timeout: 1500,
    });

    const arrivalTimes = predictions.map(({ arrT: arrivalTime }) => moment(arrivalTime).diff(moment(), 'minutes'));

    trainInfo.arrivalTimes = arrivalTimes.filter(time => time !== 0).slice(0, 2);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Error retrieving train info:', e && e.message);

    trainInfo.hasError = true;
  }

  return trainInfo;
}

async function getTransitData() {
  const [busesData, trainsData] = await axios.all([getBuses(), getTrains()]);

  return {
    hasError: busesData.hasError || trainsData.hasError,
    busesData,
    trainsData,
  };
}

export default new DataCache(getTransitData, 1);
