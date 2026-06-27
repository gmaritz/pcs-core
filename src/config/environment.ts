export interface EnvironmentConfig { readonly nodeEnv: string; }

export const environmentConfig: EnvironmentConfig = { nodeEnv: process.env.NODE_ENV ?? 'development' };

