import { exec } from 'child_process';

import { IDownloadParams } from '@interfaces/services/downloadService';
import { RouteError } from '@other/classes';
import HttpStatusCodes from '@constants/HttpStatusCodes';

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
export async function convert({ url }: IDownloadParams): Promise<void> {
    const name = url.substring(url.lastIndexOf('/') + 1);
    try {
        await exec(`rcg2txt ./download/${name} > ./download/${name}.txt`);
    } catch (error) {
        console.error('Error:', error);
        throw new RouteError(
            HttpStatusCodes.BAD_GATEWAY,
            Errors.onConvert(name),
        );
    }
}

export default {
    convert,
} as const;
