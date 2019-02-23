// https://www.mojotech.com/blog/node-js-memory-cache/
export default class DataCache {
  constructor(fetchFunction, minutesToLive = 0) {
    this.millisecondsToLive = minutesToLive * 60 * 1000;
    this.fetchFunction = fetchFunction;
    this.cache = null;
    this.fetchDate = new Date(0);
  }

  isCacheExpired = () => this.fetchDate.getTime() + this.millisecondsToLive < new Date().getTime();

  getData = async () => {
    if (!this.cache || this.isCacheExpired()) {
      try {
        const data = await this.fetchFunction();
        this.cache = data;
        this.fetchDate = new Date();

        return data;
      } catch (e) {
        throw new Error('Error retrieving data from API:', e && e.message);
      }
    }

    return Promise.resolve(this.cache);
  };
}