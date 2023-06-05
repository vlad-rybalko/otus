const fs = require('fs');
const path = require('path');

function tree(directory) {
    const result = {
        files: [],
        folders: []
    };

    function traverse(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        entries.forEach((entry) => {
            const entryPath = path.join(currentDir, entry.name);

            if (entry.isFile()) {
                result.files.push(entryPath);
            } else if (entry.isDirectory()) {
                result.folders.push(entryPath);
                traverse(entryPath);
            }
        });
    }

    traverse(directory);

    return result;
}

const currentDir = __dirname;

const directoryPath = process.argv[2] ?? currentDir;
const directoryTree = tree(directoryPath);
console.log(directoryTree);