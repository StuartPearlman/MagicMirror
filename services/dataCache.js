// h/t https://www.mojotech.com/blog/node-js-memory-cache/
export default class DataCache {
  constructor(fetchFunction, minutesToLive = 0) {
    this.millisecondsToLive = minutesToLive * 60 * 1000;
    this.fetchFunction = fetchFunction;
    this.cache = {};
    this.fetchDate = new Date(0);
  }

  isCacheExpired = () => this.fetchDate.getTime() + this.millisecondsToLive < new Date().getTime();

  getData = async () => {
    if (!Object.keys(this.cache).length || this.isCacheExpired() || this.cache.hasError) {
      try {
        const data = await this.fetchFunction();
        this.cache = data;
        this.fetchDate = new Date();

        return data;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error populating cache:', e && e.message);
      }
    }

    return Promise.resolve(this.cache);
  };
}
