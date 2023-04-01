
import logger from 'jet-logger';

import EnvVars from '@src/constants/EnvVars';
import { server } from './server';


// **** Run **** //

const SERVER_START_MSG = ('Express server started on port: ' +
  3000);

server.listen(3000, () => logger.info(SERVER_START_MSG));
