class CatalogGroup {
    constructor(name, composites=[]) {
        this.name = name;
        this.composites = composites;
    }

    get total() {
        return this.composites.reduce((total, composite) => total + composite.total, 0);
    }

    print() {
        console.log(`\n${this.name.toUpperCase()}`);
        this.composites.forEach(composite => composite.print());
    }
}

module.exports = CatalogGroup;