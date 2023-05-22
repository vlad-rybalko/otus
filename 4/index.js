const fs = require('fs');
const path = require('path');

function tree(directory) {
    const result = {
        files: [],
        folders: []
    };

    function traverse(currentDir) {
        fs.readdir(currentDir, { withFileTypes: true }, (err, entries) => {
            if (err) {
                console.error(err);
                return;
            }

            entries.forEach((entry) => {
                const entryPath = path.join(currentDir, entry.name);

                if (entry.isFile()) {
                    result.files.push(entryPath);
                } else if (entry.isDirectory()) {
                    result.folders.push(entryPath);
                    traverse(entryPath); // Recursive call for subdirectories
                }
            });
        });
    }

    traverse(directory);

    return result;
}

const directoryPath = '/';
const directoryTree = tree(directoryPath);
console.log(directoryTree);