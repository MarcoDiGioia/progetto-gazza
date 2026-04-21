declare namespace NodeJS {
  interface ProcessEnv {
    ENV?: 'dev' | 'test' | 'prod';
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
