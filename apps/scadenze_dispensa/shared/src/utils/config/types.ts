export interface AppConfig {
  ENV: 'dev' | 'test' | 'prod';
  ads: {
    bannerId: string;
    interstitialId: string;
  };
  db: {
    name: string;
  };
  notifications: {
    channelId: string;
    channelName: string;
  };
  app: {
    name: string;
    version: string;
    author: string;
    debugMode: boolean;
  };
}
