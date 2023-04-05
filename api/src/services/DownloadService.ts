import { createWriteStream, readdirSync } from 'fs';
import axios from 'axios';
import { pipeline } from 'stream/promises';
import { IDownloadParams } from '@interfaces/services/downloadService';
import HttpStatusCodes from '@constants/HttpStatusCodes';
import { RouteError } from '@other/classes';


// Errors
const Errors = {
    onDownload(url: string) {
        return `No se pudo descargar el archivo de la URL ${url}.`
    },
} as const;

// **** Functions **** //

/**
 * Descarga un archivo desde una URL y lo guarda en la carpeta 'download'.
 * @param url - La URL del archivo a descargar.
 * @throws Error si no se puede descargar el archivo.
 */
export async function download({ url }: IDownloadParams): Promise<void> {
    try {
        const name = url.substring(url.lastIndexOf('/') + 1);
        const dirs = readdirSync('./download');
        if (!dirs.length || dirs.indexOf(name) < 0) {
            const response = await axios.get(url, { responseType: 'stream' });
            await pipeline(response.data, createWriteStream(`./download/${name}`));
        }
    } catch (error) {
        console.error('Error:', error);
        throw new RouteError(
            HttpStatusCodes.BAD_GATEWAY,
            Errors.onDownload(url),
        );
    }
}

export default {
    download,
} as const;