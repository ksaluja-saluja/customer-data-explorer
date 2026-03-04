export interface Config {
  apiBaseUrl: string;
  customerApiEndpoint: string;
}

// Load config based on environment
// Use VITE_CONFIG_ENV environment variable or fall back to NODE_ENV
const env = (import.meta.env.VITE_CONFIG_ENV || import.meta.env.MODE || 'development') as 'development' | 'staging' | 'production';

let config: Config;

async function importConfig(environment: string): Promise<Config> {
  if (environment === 'production') {
    return import('./production.json').then(m => m.default);
  } else if (environment === 'staging') {
    return import('./staging.json').then(m => m.default);
  } else {
    return import('./development.json').then(m => m.default);
  }
}

// Initialize config
await importConfig(env).then(cfg => {
  config = cfg;
});

export function getConfig(): Config {
  if (!config) {
    throw new Error('Config not initialized');
  }
  return config;
}
