import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './constants/Paths';
import ConverterRoutes from '@controllers/convertController';


// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();


// **** Setup **** //

const convertRouter = Router();

// download from url
convertRouter.post(
  Paths.Convert.Url,
  validate('url'),
  validate('room'),
  ConverterRoutes.convertFromUrl,
);

// Add ConverterRouter
apiRouter.use(Paths.Convert.Base, convertRouter);


// **** Export default **** //

export default apiRouter;
