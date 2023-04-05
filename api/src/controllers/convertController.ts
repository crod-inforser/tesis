import { download } from '@services/DownloadService'
import { convert } from '@services/ConvertService'
import HttpStatusCodes from '@constants/HttpStatusCodes';
import { generateAndSendJSON } from '@util/robocupParser';
import { IConvertReq, IConvertFromUrlParams } from '@interfaces/controllers/convertController';
import { IReq, IRes } from '@routes/types/express/misc';

async function convertFromUrl(
    req: IReq<IConvertReq>,
    res: IRes
): Promise<void> {
    try {
        const { url, room } = req.body as IConvertFromUrlParams;
        await download({ url })
        await convert({ url })
        await generateAndSendJSON({ path: `./download/${name}.txt`, room });
        res.status(HttpStatusCodes.OK).json({ data: null });
    } catch (error) {
        console.error('Error:', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ data: null });
    }
}

export default {
    convertFromUrl,
} as const;
