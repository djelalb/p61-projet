import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.cts-strasbourg.eu/v1',
  auth: {
    username: __CTS_KEY__,
  },
});

let cached = (lsItemKey, invalidateCache = false, callback) => {
  let lsItem = localStorage.getItem(lsItemKey) ? JSON.parse(localStorage.getItem(lsItemKey)) : null;

  if (!invalidateCache && lsItem && new Date(lsItem.ts).setMinutes(new Date(lsItem.ts).getMinutes() + 1) > Date.now()) {
    return lsItem.data;
  } else {
    return callback(null).then((data) => {
      localStorage.setItem(
        lsItemKey,
        JSON.stringify({
          ts: Date.now(),
          data,
        }),
      );

      return data;
    });
  }
};

/*
  SIRI
*/

const getLinesDelivery = async (cache = true) => {
  return cached('linesDelivery', !cache, async () => {
    const response = await instance.get('/siri/2.0/lines-discovery');

    return response.data.LinesDelivery;
  });
};

const getStopPoints = async (lineRef, includeLinesDestinations = false, cache = true) => {
  return cached('stopPoints', !cache, async () => {
    try {
      const response = await instance.get('/siri/2.0/stoppoints-discovery', {
        params: {
          includeLinesDestinations,
        },
      });
      return response.data.StopPointsDelivery;
    } catch (error) {
      console.error('Error fetching stop points:', error);
      throw error;
    }
  });
};

/*
  CTS
*/

const getParkings = async (cache = true) => {
  return cached('parkings', !cache, async () => {
    const response = await instance.get('/cts/park-and-ride');

    return response.data.ParkAndRide;
  });
};

const getVeloparcs = async (cache = true) => {
  return cached('veloparcs', !cache, async () => {
    const response = await instance.get('/cts/veloparc');

    return response.data.Veloparc;
  });
};

const getRetailOulets = async (cache = true) => {
  return cached('retailOutlets', !cache, async () => {
    const response = await instance.get('/cts/retail-outlet');

    return response.data.RetailOutlet;
  });
};

export { getLinesDelivery, getStopPoints, getParkings, getRetailOulets, getVeloparcs };
