// ==========================================================
// PCS Core Environment Configuration
// ==========================================================

export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  appName: string;
  appVersion: string;
}

export const environment: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  port: Number(process.env.PORT ?? 3000),

  appName: 'PCS Core',

  appVersion: '1.0.0',
};

export default environment;