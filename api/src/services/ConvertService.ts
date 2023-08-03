import { promisify } from 'util';
import { exec } from 'child_process';
import logger from 'jet-logger';

import { IConvertParams } from '../interfaces/services/downloadService';
import { RouteError } from '../other/classes';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { readdirSync } from 'fs';

const do_exec = promisify(exec);

// Errors
const Errors = {
  onConvert(name: string): string {
    return `No se pudo convertir el archivo RCG ${name}.`;
  },
} as const;

/**
 * Convierte un archivo RCG a TXT.
 * @param url - La URL del archivo RCG a convertir.
 * @throws RouteError si no se puede convertir el archivo RCG.
 */
export async function convert({ name }: IConvertParams): Promise<void> {
  try {
    logger.info(`convert ${name} to txt`);
    const dirs = readdirSync('./download');
    if (!dirs.length || dirs.indexOf(name + '.txt') < 0) {
      logger.info('file not exist, converting...');
      await do_exec(`rcg2txt ./download/${name} > ./download/${name}.txt`);
    } else logger.info('file converted exist');
    logger.info('finish converted to txt');
  } catch (error: unknown) {
    if (error && typeof error === 'string')
      logger.err(`Error on convert file to txt ${error} `);
    throw new RouteError(
      HttpStatusCodes.BAD_GATEWAY,
      Errors.onConvert(name),
    );
  }
}

export default {
  convert,
} as const;
