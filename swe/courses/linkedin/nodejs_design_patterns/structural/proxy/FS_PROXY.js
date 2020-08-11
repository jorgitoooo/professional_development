class FS_PROXY {
    constructor(fs) {
        this.fs = fs;
    }

    readFile(path, format, cb) {
        if (!path.match(/.md$|.MD$/)) {
            return cb(new Error('Can only read markdown files.'));
        }

        this.fs.readFile(path, format, (error, contents) => {
            if (error) {
                console.error(error);
                return cb(error);
            }

            return cb(null, contents);
        });
    }
}

module.exports = FS_PROXY;