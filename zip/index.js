const { unzip } = require('node:zlib');
const sizeof = require('object-sizeof')
const { promisify } = require('node:util');
const do_unzip = promisify(unzip);
const do_deflate = promisify(deflate);

async function start() {
    const data = "lorem ipsum dolor sit amet";
    console.log(data, sizeof(data));
    const buffer = await do_deflate(data)
    console.log(buffer, sizeof(buffer), buffer.toString('base64'), sizeof(buffer.toString('base64')));
    const unziped = await do_unzip(buffer);
    console.log(unziped, sizeof(unziped), unziped.toString(), sizeof(unziped.toString()));
}
start()