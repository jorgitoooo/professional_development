var path = require('path');
var FS_PROXY = require('./FS_PROXY');

var fs = new FS_PROXY(require('fs'));

var txtFile = path.join(__dirname, 'Readme.txt');
var mdFile = path.join(__dirname, 'Readme.md');

function result(error, contents) {
    if (error) {
        console.log('\x07');
        console.error(error);
        process.exit(1);
    }

    console.log('reading file...');
    console.log(contents);
}

fs.readFile(txtFile, 'UTF-8', result);
fs.readFile(mdFile, 'UTF-8', result);