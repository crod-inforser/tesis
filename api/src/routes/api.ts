import { Router } from 'express';
import jetValidator from 'jet-validator';
import multer from 'multer';

import Paths from './constants/Paths';
import ConverterRoutes from '../controllers/convertController';


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


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'download/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


convertRouter.post(
  Paths.Convert.Upload,
  upload.single('rcgFile'),
  validate('room'),
  ConverterRoutes.convertFromFile,
);

// Add ConverterRouter
apiRouter.use(Paths.Convert.Base, convertRouter);


// **** Export default **** //

export default apiRouter;
