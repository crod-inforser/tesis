/* eslint-disable node/no-process-env */

import { NodeEnvs } from './misc';

export default {
  NodeEnv: (process.env.NODE_ENV ?? NodeEnvs.Dev),
  Port: (process.env.PORT ?? 3000),
} as const;
