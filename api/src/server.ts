/**
 * Setup express server.
 */

import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, } from 'express';
import logger from 'jet-logger';
import cors from 'cors'
import { createServer } from 'http';
import 'express-async-errors';

import {initializeSocket} from './socket'
import BaseRouter from '@routes/api';
import Paths from '@routes/constants/Paths';

import EnvVars from '@constants/EnvVars';
import HttpStatusCodes from '@constants/HttpStatusCodes';

import { NodeEnvs } from '@constants/misc';
import { RouteError } from '@other/classes';


// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(cors({ origin: "*" }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev) app.use(morgan('dev'));

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production) app.use(helmet());


// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test) logger.err(err, true);
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) status = err.status;
  return res.status(status).json({ error: err.message });
});


const server = createServer(app);
const io = initializeSocket(server)
// **** Export default **** //


export { app, server, io }