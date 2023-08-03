import logger from 'jet-logger';
import { download } from '@services/DownloadService';
import { convert } from '@services/ConvertService';
import HttpStatusCodes from '@constants/HttpStatusCodes';
import { generateAndSendJSON } from '@util/robocupParser';
import {
  IConvertReq, IConvertFromUrlParams, IReq, IRes, IRoomReq, IUploadReq,
} from '@interfaces/controllers/convertController';
import { handlePause, handleResume } from '@services/SocketService';

async function convertFromUrl(
  req: IReq<IConvertReq>,
  res: IRes,
): Promise<void> {
  try {
    const { url, room } = req.body as IConvertFromUrlParams;
    logger.info(`new request from /url, room: ${room}, url: ${url} `);
    const name = url.substring(url.lastIndexOf('/') + 1);
    await download({ url, name });
    await convert({ name });
    generateAndSendJSON({ path: `./download/${name}.txt`, room });
    logger.info('end request');
    res.status(HttpStatusCodes.OK).json({ data: null });
  } catch (error: unknown) {
    if (error && typeof error === 'string')
      logger.err(`Error on download ${error} `);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ data: null });
  }
}

async function convertFromFile(
  req: IReq<IUploadReq>,
  res: IRes,
): Promise<void> {
  try {

    const { room } = req.body as IUploadReq;
    const file = req.file;
    if (!file)
      res.status(400).json({ message: 'No se ha seleccionado ningún archivo.' });

    logger.info(`new request from /upload, room: ${room}, file: ${file.filename} `);
    const name = file.filename
    await convert({ name });
    generateAndSendJSON({ path: `./download/${name}.txt`, room });
    logger.info('end request');
    res.status(HttpStatusCodes.OK).json({ data: null });
  }
  catch (error: unknown) {
    if (error && typeof error === 'string')
      logger.err(`Error on download ${error} `);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ data: null });
  }


}


export default {
  convertFromUrl,
  convertFromFile
} as const;
