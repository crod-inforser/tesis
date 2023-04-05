/**
 * Setup express server.
 */

import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import cors from 'cors'
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';
import Paths from '@src/routes/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
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


// ** Front-End Content ** //

const server = createServer(app);

const io = new SocketIOServer(server, { cors: { origin: "*", methods: "*" } });

io.on('connection', (socket) => {
  console.log('User connected');

  // Escuchar evento 'joinRoom'
  socket.on('joinRoom', (room) => {
    console.log(`User joined room ${room}`);
    socket.join(room);
  });

  // Escuchar evento 'disconnect'
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// **** Export default **** //

export { app, server, io }