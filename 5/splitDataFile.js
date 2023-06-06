const path = require('path');
const fs = require('fs');

const MB = 1000000;
const chunkSize = 10;

async function splitSortFile(filePath, chunkDir) {
    createOrCheckChunkDir(chunkDir);

    let bufferString = '';
    let prevTail = '';
    let fileNameCount = 1;

    const readStream = fs.createReadStream(filePath);

    for await (const chunk of readStream) {
        bufferString += chunk;
        const sizeInBytes = Buffer.byteLength(bufferString, 'utf8');

        if (sizeInBytes > chunkSize * MB) {
            const { main, tail } = getMainAndTail(bufferString, prevTail);
            prevTail = tail;
            await sortAndWriteToFile(main, getChunkFileName(chunkDir, fileNameCount));
            fileNameCount++;
            bufferString = '';
        }
    }

    const { main, tail } = getMainAndTail(bufferString, prevTail);
    prevTail = tail;
    await sortAndWriteToFile(main, getChunkFileName(chunkDir, fileNameCount));

    console.log('Файлы созданы');
}

function createOrCheckChunkDir(chunkDir) {
    if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir);
    }
}

function getChunkFileName(chunkDir, fileNameCount) {
    return path.join(chunkDir, `${fileNameCount}.txt`);
}

function getMainAndTail(str, prevTail) {
    const lastIndex = str.lastIndexOf(' ');
    if (lastIndex === -1) {
        return { main: str, tail: '' };
    }
    const main = prevTail + str.slice(0, lastIndex);
    const tail = str.slice(lastIndex + 1);
    return { main, tail };
}

async function sortAndWriteToFile(str, fileName) {
    const sorted = getSorted(str);
    await fs.promises.writeFile(fileName, sorted);
}

function getSorted(str) {
    const arrayOfNumbers = str.split(' ').map(Number);
    arrayOfNumbers.sort((a, b) => a - b);
    return arrayOfNumbers.join(' ');
}

module.exports = splitSortFile;