class Conductor {
    constructor() {
        this.history = [];
        this.undone = [];
    }

    run(cmd) {
        console.log(`Executing command: ${cmd.name}`);
        cmd.execute();
        this.history.push(cmd);
    }

    printHistory() {
        this.history.forEach( cmd => console.log(cmd.name));
    }

    undo() {
        var cmd = this.history.pop();
        console.log(`undo ${cmd.name}`);
        cmd.undo();
        this.undone.push(cmd);
    }

    redo() {
        var cmd = this.undone.pop();
        console.log(`redo ${cmd.name}`);
        cmd.execute();
        this.history.push(cmd);
    }
}

module.exports = new Conductor();