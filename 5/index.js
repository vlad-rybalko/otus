const path = require('path');
const generateUnsortedFile = require('./createDataFile.js');
const splitSortFile = require('./splitDataFile.js');
const processChunks = require('./mergeSortFiles.js');


const filePath = path.join(__dirname, 'data.txt');
const chunkDir = path.join(__dirname, 'chunks');
const resultFilePath = path.join(__dirname, 'result.txt');

async function startScript() {
    generateUnsortedFile(filePath);
    await splitSortFile(filePath, chunkDir);
    await processChunks(chunkDir, resultFilePath);
}

startScript()