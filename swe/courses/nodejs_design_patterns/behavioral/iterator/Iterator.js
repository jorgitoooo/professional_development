class Iterator {
    constructor(items=[]) {
        this.index = 0;
        this.items = items;
    }

    hasNext() {
        return this.index < this.items.length - 1;
    }

    current() {
        return this.items[this.index];
    }

    hasPrev() {
        return this.index > 0;
    }

    first() {
        var [first] = this.items;
        return first;
    }
    last() {
        var lastIdx = this.items.length - 1;
        return this.items[lastIdx]
    }
    next() {
        if (this.hasNext()) {
            this.index += 1;
        }
        return this.current();
    }
    prev() {
        if (this.hasPrev()) {
            this.index -= 1;
        }
        return this.current();
    }

}

module.exports = Iterator;