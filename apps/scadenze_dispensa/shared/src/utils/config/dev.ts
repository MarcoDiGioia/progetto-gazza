import type { AppConfig } from './types';

const devConfig: AppConfig = {
  ENV: 'dev',
  ads: {
    bannerId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
  },
  db: {
    name: 'scadenze_dispensa_dev.db',
  },
  notifications: {
    channelId: 'scadenze_dispensa_channel',
    channelName: 'Notifiche Scadenze',
  },
  app: {
    name: 'Scadenze Dispensa Gratis',
    version: '1.0.0',
    author: 'Progetto Gazza',
    debugMode: true,
  },
};

export default devConfig;
