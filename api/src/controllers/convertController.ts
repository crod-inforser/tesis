import logger from 'jet-logger';
import { download } from '@services/DownloadService'
import { convert } from '@services/ConvertService'
import HttpStatusCodes from '@constants/HttpStatusCodes';
import { generateAndSendJSON } from '@util/robocupParser';
import { IConvertReq, IConvertFromUrlParams, IReq, IRes, IRoomReq } from '@interfaces/controllers/convertController';
import { handlePause, handleResume } from '@services/SocketService';

async function convertFromUrl(
    req: IReq<IConvertReq>,
    res: IRes
): Promise<void> {
    try {
        const { url, room } = req.body as IConvertFromUrlParams;
        logger.info(`new request from /url, room: ${room}, url: ${url} `)
        const name = url.substring(url.lastIndexOf('/') + 1);
        await download({ url, name })
        await convert({ name })
        generateAndSendJSON({ path: `./download/${name}.txt`, room });
        logger.info(`end request`)
        res.status(HttpStatusCodes.OK).json({ data: null });
    } catch (error) {
        logger.err(`Error on download ${error} `)
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ data: null });
    }
}

function pauseStream(
    req: IReq<IRoomReq>,
    res: IRes
): void {
    const room = req.params.room;
    handlePause(room);
    res.sendStatus(200);
}

function resumeStream(
    req: IReq<IRoomReq>,
    res: IRes
): void {
    const room = req.params.room;
    handleResume(room);
    res.sendStatus(200);
}

export default {
    convertFromUrl,
    pauseStream,
    resumeStream
} as const;
