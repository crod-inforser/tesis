import axios from 'axios';
import { exec } from 'child_process'
import { promisify } from 'util';
import { createWriteStream, readdirSync } from 'fs'
import { pipeline } from 'stream/promises';
// eslint-disable-next-line

import { IReq, IRes } from './types/express/misc';

import { generateAndSendJSON } from '@src/util/misc'
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
const do_exec = promisify(exec);

// **** Types **** //

interface IConvertReq {
    url: string;
    room: string;
}

// **** Functions **** //

/**
 * POST url rcg.gz 
 */
async function convertFromUrl(req: IReq<IConvertReq>, res: IRes) {
    try {
        const { url, room } = req.body;
        const name = url.substring(url.lastIndexOf('/') + 1);
        const dirs = readdirSync("./download")
        if (!dirs.length || dirs.indexOf(name) < 0) {
            const response = await axios.get(url, { responseType: 'stream' });
            await pipeline(response.data, createWriteStream(`./download/${name}`));
        }
        await do_exec(`rcg2txt ./download/${name} > ./download/${name}.txt`)
        await generateAndSendJSON({ path: `./download/${name}.txt`, room });
        return res.status(HttpStatusCodes.OK).end();

    } catch (e) {
        console.error("error", e)
    }
}

export default {
    convertFromUrl,
} as const;
