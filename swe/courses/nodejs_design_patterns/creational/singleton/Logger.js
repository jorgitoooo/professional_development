class Logger {
    constructor() {
        this.logs = [];
    }
    getCount() {
        return this.logs.length;
    }
    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        console.log(`${timestamp} :: ${message}`);
    }
}

module.exports = new Logger();

/* Clean but verbose way of making a Singleton for the Logger
class Singleton {
    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Logger();
        }
    }
    getInstance() {
        return Singleton.instance;
    }
}

module.exports = Singleton;
*/