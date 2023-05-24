const fs = require('fs');
const path = require('path');

function tree(dirPath, result = { files: [], dirs: [] }) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(dirPath, file.name);

        if (file.isDirectory()) {
          result.dirs.push(filePath);
          tree(filePath, result);
        } else {
          result.files.push(filePath);
        }
      });

      resolve(result);
    });
  });
}

const dirPath = './';

tree(dirPath)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
