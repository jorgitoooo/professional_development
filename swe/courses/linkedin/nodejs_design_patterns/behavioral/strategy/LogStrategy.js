var path = require('path');
var { appendFile } = require('fs');
var morse = require('morse');

var constants = require('./constants');

class LogStrategy {
    static noDate(timestamp, message) {
        console.log(message);
    }
    
    static toMorseCode(timestamp, message) {
        var morseCode = morse.encode(message);
        console.log(morseCode);
    }

    static toFile(timestamp, message) {
        var fileName = path.join(__dirname, constants.LOGS.FILENAME);
        var log = `${timestamp} :: ${message}\n`;

        appendFile(fileName, log, error => {
            if (error) {
                console.log('Error while writing to file.');
                console.error(error);
            }
        });
    }

    static toConsole(timestamp, message) {
        console.log(`${timestamp} :: ${message}`);
    }

    static none(timestamp, message) {
        // Does nothing
    }
}

module.exports = LogStrategy;