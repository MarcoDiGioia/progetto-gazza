import type { AppConfig } from './types';

const testConfig: AppConfig = {
  ENV: 'test',
  ads: {
    bannerId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
  },
  db: {
    name: 'scadenze_dispensa_test.db',
  },
  notifications: {
    channelId: 'scadenze_dispensa_channel',
    channelName: 'Notifiche Scadenze',
  },
  app: {
    name: 'Scadenze Dispensa Gratis',
    version: '1.0.0',
    author: 'Marco Di Gioia',
    debugMode: true,
  },
};

export default testConfig;
