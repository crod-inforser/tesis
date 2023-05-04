import { createWriteStream, readdirSync } from 'fs';
import axios from 'axios';
import logger from 'jet-logger';
import { pipeline } from 'stream/promises';
import { IDownloadParams } from '@interfaces/services/downloadService';
import HttpStatusCodes from '@constants/HttpStatusCodes';
import { RouteError } from '@other/classes';


// Errors
const Errors = {
  onDownload(url: string) {
    return `No se pudo descargar el archivo de la URL ${url}.`;
  },
} as const;

// **** Functions **** //

/**
 * Descarga un archivo desde una URL y lo guarda en la carpeta 'download'.
 * @param url - La URL del archivo a descargar.
 * @throws Error si no se puede descargar el archivo.
 */
export async function download({ url, name }: IDownloadParams): Promise<void> {
  try {
    const dirs = readdirSync('./download');
    logger.info(`download ${name}`);
    if (!dirs.length || dirs.indexOf(name) < 0) {
      logger.info('file not exist, downloading...');
      const response = await axios.get(url, { responseType: 'stream' });
      logger.info('url success');
      await pipeline(response.data, createWriteStream(`./download/${name}`));
      logger.info('donwloaded!');
    } else logger.info('file downloaded exist');
    logger.info('finish download');
  } catch (error: unknown) {
    if (error && typeof error === 'string')
      throw new RouteError(
        HttpStatusCodes.BAD_GATEWAY,
        Errors.onDownload(url),
      );
  }
}

export default {
  download,
} as const;