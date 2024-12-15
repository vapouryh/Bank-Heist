class Location {
    constructor(name, description, position, accessibleBy, locked, contains) {
        this.name = name;
        this.description = description;
        this.position = position;
        this.accessibleBy = accessibleBy;
        this.locked = locked;
        this.contains = contains;
    }

    getExit(direction) {
        if (this.accessibleBy.includes(direction)) {
            switch (direction) {
                case 'N':
                    return this.position - 4;
                case 'E':
                    return this.position + 1;
                case 'S':
                    return this.position + 4;
                case 'W':
                    return this.position - 1;
            }
        } else throw new Error("You can't go that way.\n");
    }

    floorItems() {
        let floorItems;
        if (!this.contains.length || (this.contains[0].hasOwnProperty("items") && this.contains.length === 1)) return
        if (!this.contains[0].hasOwnProperty("weight") && this.contains.length > 1) {
            floorItems = this.contains.slice(1);
            let str = "\nOn the floor lays:\n"
            floorItems.forEach(item => {
                const isHeavy = (item.weight === 2)
                str += `   - ${item.name} ${isHeavy ? '(HEAVY)' : ''}\n`
            })
            return str;
        } else {
            floorItems = this.contains;
            let str = "\nOn the floor lays:\n"
            floorItems.forEach(item => {
                const isHeavy = (item.weight === 2)
                str += `   - ${item.name} ${isHeavy ? '(HEAVY)' : ''}\n`
            })
            return str;
        }
    }
}

export default Location;