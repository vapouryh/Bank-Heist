class Player {
    constructor(locations, items, allContainers, setShowDrillGame, setShowHackingGame) {
        this.inventory = [];
        this.locations = locations;
        this.currentLocation = locations[14];
        this.items = items;
        this.allContainers = allContainers;
        this.hostageTimer = 30;
        this.guardAlive = true;
        this.cctvGuardAlive = true;
        this.setShowDrillGame; setShowDrillGame;
        this.setShowHackingGame = setShowHackingGame;
    }

    updateLocation(position) {
        if (!this.locations[position].locked) {
            this.currentLocation = this.locations[position];
            const floorItems = this.currentLocation.floorItems()
            let output = `\n${this.currentLocation.description}\n${floorItems || ''}`;

            return output;
        } else throw new Error("\nThis door is locked. \n\nYou'll need a key for this.")
    }

    findContainer(containerName) {
        const foundContainer = this.allContainers.find(container => container.name === containerName);
        const inRoom = this.currentLocation.contains.some(container => container.name === containerName);
        return [foundContainer, inRoom];
    }

    findItem(itemName) {
        return this.items.find(item => item.name === itemName);
    }

    getInventory() {
        let str;
        if (this.inventory.length) {
            str = `You are carrying: (${this.inventoryWeight}/4)\n`;
            this.inventory.forEach(item => {
                const isHeavy = (item.weight === 2)
                str += `   - ${item.name} ${isHeavy ? '(HEAVY)' : ''}\n`
            })
        } else {
            str = 'Your inventory is empty!\n'
        }
        return str;
    }

    get inventoryWeight() {
        let weight = 0;
        this.inventory.forEach(item => {
            weight += item.weight;
        })
        return weight;
    }
}

export default Player;