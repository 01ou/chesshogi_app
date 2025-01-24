declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_API_URL: string;
    }
  }
}

export {};
