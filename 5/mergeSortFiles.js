const path = require('path');
const fs = require('fs');

const highWaterMark = 1024;

function addListenersToStream(streamObj) {
    streamObj.stream.on('data', (data) => {
        streamObj.stream.pause();
        const tailBuffer = Buffer.from(streamObj.tail, 'utf-8');
        const dataWithPrevTail = Buffer.concat([tailBuffer, data]).toString();
        streamObj.tail = dataWithPrevTail;
        streamObj.length = dataWithPrevTail.length;
        streamObj.isPadding = false;
    });

    streamObj.stream.on('end', () => {
        streamObj.isDone = true;
        streamObj.isPadding = false;
    });
}

function getChunkStreams(chunkDir) {
    const result = {};
    const files = fs.readdirSync(chunkDir);

    for (let filename of files) {
        const filePath = path.join(chunkDir, filename);
        const streamObj = {
            stream: fs.createReadStream(filePath, { highWaterMark }),
            tail: '',
            length: 0,
            num: undefined,
            isDone: false,
            isPadding: false,
        };

        addListenersToStream(streamObj);
        result[filename] = streamObj;
    }

    return result;
}

function getNextNumAndTail(str) {
    const index = str.indexOf(' ');

    if (index === -1) {
        return { num: parseInt(str, 10), tail: '' };
    }

    const num = str.slice(0, index);
    const tail = str.slice(index + 1);
    return { num: parseInt(num, 10), tail };
}

function hasUnfinishedChunks(chunkStreams) {
    for (let file in chunkStreams) {
        if (!chunkStreams[file].isDone || chunkStreams[file].tail.length) {
            return true;
        }
    }

    return false;
}

function waitForPadding(streamObj) {
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (!streamObj.isPadding) {
                clearInterval(intervalId);
                resolve();
            }
        }, 1);
    });
}

async function processChunks(chunkDir, resultFilePath) {
    console.log('Начало обработки чанков...');
    const chunkStreams = getChunkStreams(chunkDir);

    while (hasUnfinishedChunks(chunkStreams)) {
        let min = Infinity;

        for (let file in chunkStreams) {
            const streamObj = chunkStreams[file];

            if (
                streamObj.tail.length <= streamObj.length * 0.1 &&
                !streamObj.isDone
            ) {
                streamObj.isPadding = true;
                streamObj.stream.resume();
                await waitForPadding(streamObj);
            }

            if (streamObj.num === undefined && streamObj.tail.length) {
                const { num, tail } = getNextNumAndTail(streamObj.tail);
                streamObj.num = num;
                streamObj.tail = tail;
            }

            min = Math.min(min, streamObj.num ?? Infinity);
        }

        for (let file in chunkStreams) {
            const streamObj = chunkStreams[file];

            if (streamObj.num === min) {
                fs.appendFileSync(resultFilePath, min + ' ');
                streamObj.num = undefined;
                min = Infinity;
                break;
            }
        }
    }
    console.log('Обработка чанков завершена.');
}

const chunkDirPath = path.join(__dirname, 'chunks');
const resultFilePath = path.join(__dirname, 'result.txt');
processChunks(chunkDirPath, resultFilePath);
