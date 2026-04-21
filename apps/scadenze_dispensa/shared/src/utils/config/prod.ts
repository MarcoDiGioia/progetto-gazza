import type { AppConfig } from './types';

// Sostituisci i placeholder con gli ID reali dal tuo account AdMob
// https://admob.google.com → App → Unità Annuncio
const prodConfig: AppConfig = {
  ENV: 'prod',
  ads: {
    bannerId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    interstitialId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
  db: {
    name: 'scadenze_dispensa.db',
  },
  notifications: {
    channelId: 'scadenze_dispensa_channel',
    channelName: 'Notifiche Scadenze',
  },
  app: {
    name: 'Scadenze Dispensa Gratis',
    version: '1.0.0',
    author: 'Progetto Gazza',
    debugMode: false,
  },
};

export default prodConfig;
