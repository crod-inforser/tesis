const { createReadStream } = require("fs");
const { createInterface } = require("readline")


const getReturnData = (concat, features, size) => {
    let name = '';
    if (features.length) size++
    concat.split(' ').forEach((value, index) => !index ? name = value : features.push(value))
    return { name, features: features.filter((a) => a), size };
}


function getFeature(str, cache = {}) {
    if (str in cache) return cache[str]
    let concat = '', size = 0;
    const features = [];
    for (let i = 0; i < str.length; i++) {
        size++;
        switch (str[i]) {
            case '(':
                const feature = getFeature(str.slice(i + 1), cache);
                features.push(feature);
                size += feature.size;
                i = size;
                break;
            case ')':
                const data = getReturnData(concat, features, size);
                cache[str] = data;
                return data;
            default:
                concat += str[i];
        }
    }
    const data = getReturnData(concat, features, size);
    cache[str] = data;
    return data;
}

async function readFile() {

    const rl = createInterface({
        input: createReadStream('./a.txt'),
        crlfDelay: Infinity
    });

    const arr = [];
    for await (const line of rl) {
        const data = getFeature(line);
        arr.push(data.name?data : data.features[0]);
    }

    for (let item of arr){
        console.log(item.features)
    }
}

readFile();