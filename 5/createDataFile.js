const path = require('path');
const fs = require('fs');

const fileSizeInMB = 1; // Размер файла в Мб
const MB = 1000000;

function generateUnsortedFile(filePath) {
    let fillPart = 0.1;
    const targetFileSize = fileSizeInMB * MB;

    while (true) {

        try {
            const { size: fileSizeInBytes } = fs.statSync(filePath);
            const currentFileSizeInMB = Math.trunc(fileSizeInBytes / MB);

            if (currentFileSizeInMB >= fileSizeInMB * fillPart) {
                fillPart += 0.1;
            }

            if (fileSizeInBytes > targetFileSize) {
                return;
            }
        } catch (error) {
            console.log('Создаем файл');
        }

        const randomNumber = Math.round(Math.random() * (100 - fillPart * 10));
        fs.appendFileSync(filePath, randomNumber + ' ');
    }
}

const filePath = path.join(__dirname, 'data.txt');
generateUnsortedFile(filePath);
