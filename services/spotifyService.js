// h/t https://github.com/raywo/MMM-NowPlayingOnSpotify
import moment from 'moment';
import axios from 'axios';
import { Buffer } from 'buffer';
import qs from 'query-string';
import keys from '../keys';

const { spotifyConfig } = keys;

class SpotifyService {
  constructor() {
    this.credentials = spotifyConfig;
    this.tokenExpiresAt = moment();
  }

  async retrieveCurrentlyPlaying() {
    let currentlyPlaying;

    try {
      if (moment().isAfter(this.tokenExpiresAt)) {
        await this.refreshAccessToken();
      }

      const options = {
        headers: {
          Authorization: `Bearer ${this.credentials.accessToken}`,
        },
        timeout: 1500,
      };

      const { data } = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', options);

      // Spotify API 204
      if (data === '') {
        currentlyPlaying = {
          isPlaying: false,
        };
      } else {
        const {
          progress_ms: songProgress,
          item: {
            name: title, duration_ms: songDuration, artists,
          },
        } = data;

        currentlyPlaying = {
          title,
          songDuration,
          songProgress,
          isPlaying: true,
          artist: artists.map(artist => artist.name).join(', '),
        };
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error retrieving Spotify info:', e && e.message);

      currentlyPlaying = {
        hasError: true,
      };
    }

    return currentlyPlaying;
  }

  async refreshAccessToken() {
    try {
      const { clientId, clientSecret } = this.credentials;
      const encodedCreds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const options = {
        headers: {
          Authorization: `Basic ${encodedCreds}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 1500,
      };

      const { data: { expires_in: expiresIn, access_token: accessToken } } = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.credentials.refreshToken,
        }),
        options,
      );

      this.credentials.accessToken = accessToken;
      this.tokenExpiresAt = moment().add(expiresIn, 'seconds');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error refreshing Spotify token:', e && e.message);
    }
  }
}

export default new SpotifyService();
