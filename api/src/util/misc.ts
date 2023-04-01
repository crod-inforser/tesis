import { createReadStream } from "fs";
import { createInterface } from "readline";
import { gzipSync } from 'zlib';
import { io } from "@src/server";


/**
 * Miscellaneous shared functions go here.
 */

interface FeatureData {
  name: string;
  features: FeatureData[];
  size: number;
}

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}




const getReturnData = (
  concat: string,
  features: FeatureData[],
  size: number
): FeatureData => {
  let name = '';
  if (features.length) size++;
  concat.split(' ').forEach((value, index) => !index ? name = value : features.push({ name: value, features: [], size: 1 }));
  return { name, features: features.filter((a) => a), size };
};

function getFeature(str: string, cache: Record<string, FeatureData> = {}): FeatureData {
  if (str in cache) return cache[str];
  let concat = '', size = 0;
  const features: FeatureData[] = [];
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



function getRandomData() {
  const data = {
    temperature: (Math.random() * (30 - 15) + 15).toFixed(2),
    humidity: (Math.random() * (90 - 60) + 60).toFixed(2),
    pressure: (Math.random() * (1100 - 900) + 900).toFixed(2),
    all: [
      {
        temperature: (Math.random() * (30 - 15) + 15).toFixed(2),
        humidity: (Math.random() * (90 - 60) + 60).toFixed(2),
        pressure: (Math.random() * (1100 - 900) + 900).toFixed(2),
      }
    ]
  };
  data.temperature = (Math.random() * (30 - 15) + 15).toFixed(2);
  data.humidity = (Math.random() * (90 - 60) + 60).toFixed(2);
  data.pressure = (Math.random() * (1100 - 900) + 900).toFixed(2);
  return data;
}

function sendToIO(room: string) {
  const data = getRandomData();
  const jsonData = JSON.stringify(data);
  const bufferData = Buffer.from(jsonData, 'utf8');
  io.to(room).emit('data', gzipSync(bufferData));
}

let counter = 0;

export async function generateAndSendJSON({ path, room }: { path: string, room: string }) {

  const intervalId = setInterval(() => {
    console.log("sending counter ", counter, " room ", room)
    counter++
    sendToIO(room);
  }, 1000);

  setTimeout(() => {
    clearInterval(intervalId);
  }, 11000);


  return;

  try {
    const rl = createInterface({
      input: createReadStream(path),
      crlfDelay: Infinity
    });

    const arr: FeatureData[] = [];
    let n = 0;
    for await (const line of rl) {
      const data = getFeature(line);
      arr.push(data.name ? data : data.features[0]);
    }
    return arr;

  } catch (e) {
    console.error("error on getjson", e)
  }
}