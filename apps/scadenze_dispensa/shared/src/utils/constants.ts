import config from './config';

export const ADS_CONFIG = {
  BANNER_ID: config.ads.bannerId,
  INTERSTITIAL_ID: config.ads.interstitialId,
};

export const NOTIFICHE_CONFIG = {
  CHANNEL_ID: config.notifications.channelId,
  CHANNEL_NAME: config.notifications.channelName,
};

export const DB_CONFIG = {
  NAME: config.db.name,
};

export const APP_INFO = {
  NAME: config.app.name,
  VERSION: config.app.version,
  AUTHOR: config.app.author,
  DEBUG: config.app.debugMode,
};
