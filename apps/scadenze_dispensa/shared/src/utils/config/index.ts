import type { AppConfig } from './types';
import devConfig from './dev';
import testConfig from './test';
import prodConfig from './prod';

type EnvKey = 'dev' | 'test' | 'prod';

const ENV = (process.env.ENV as EnvKey) || 'dev';

const configs: Record<EnvKey, AppConfig> = {
  dev: devConfig,
  test: testConfig,
  prod: prodConfig,
};

export const config: AppConfig = configs[ENV] ?? devConfig;
export default config;
