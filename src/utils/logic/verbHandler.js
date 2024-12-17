import parser from '../parser/parser.js';

export default function handleInput(input, player, locations, hostageTimer, setHostageTimer, setShowHackingGame, setShowMap, setShowGuide) {
    const parsedInput = parser.parse(input);
    const verb = parsedInput.importantWords.find(obj => obj.constructor.name === 'Verb') || null;
    const noun = parsedInput.importantWords.filter(obj => obj.constructor.name === 'Noun') || '';
    const unknownWord = parsedInput.unknownWord;
    const nounAdjective = noun[0]?.precedingAdjective?.value || '';
    const fullNoun = (nounPosition) => { return `${nounAdjective} ${noun[nounPosition]?.value}`.trim() };
    const item = player.findItem(fullNoun(0)) || player.inventory.find(item => item.name === fullNoun(0));
    const [container, containerInRoom] = player.findContainer(item?.origin || fullNoun(0));
    
    switch (verb?.value) {
        case "GO": 
            if (!noun.length) throw new Error("Go where?\n")
            const exit = player.currentLocation.getExit(noun[0]?.value[0]);
            return player.updateLocation(exit)
        case "OPEN":
            if (!noun.length) throw new Error("Open what?\n");
            const tool = player.findItem(fullNoun(1));
            if(!(player.currentLocation.position === 5) && ["CCTV ROOM", "DOOR"].includes(fullNoun(0))) throw new Error((fullNoun(0) === "DOOR") ? "There is no door here..." : "You cannot access the CCTV Room from here.")
            if (["CCTV ROOM", "DOOR"].includes(fullNoun(0))) {
                if (!player.inventory.some(item => item.name === "KEY")) {
                    throw new Error("You'll need a key to unlock this door.");
                } else {
                    locations[6].locked = false
                    return "\nYou use the small metal key to unlock the CCTV Room door.\nAfter some jiggling, the lock turns and becomes unlocked.\n"
                }
            }
            if (!container.needsInteraction) throw new Error("You can't open this object.");
            if (!container.isInspected) throw new Error(`You need to inspect the ${container.name.toLowerCase()} first.\n`)
            if (containerInRoom && container.interactionTool && !tool) throw new Error(`You'll need to use a ${container.interactionTool.toLowerCase()} to open the ${container.name.toLowerCase()}!\n`);
            if (!player.inventory.some(item => item.name === container.interactionTool) && container.interactionTool) throw new Error(`You don't have a ${container.interactionTool.toLowerCase()} in your inventory!\n`)
            if (!containerInRoom) throw new Error(`There is no ${container.name.toLowerCase()} in this room.`);
            container.isInspected = true;
            container.needsInteraction = false;
            return `\n${container.description}\n`
        case "LOOK":
            if (!noun.length && !unknownWord) return `\n${player.currentLocation.description}\n${player.currentLocation.floorItems() || ''}`
            if (!noun.length && unknownWord) throw new Error("Look at what?\n");
            if (!containerInRoom && fullNoun(0) === container?.name) throw new Error(`There is no ${container.name.toLowerCase()} in this room.`)
            if (container?.name === fullNoun(0)) {
                container.isInspected = true;
                if (container.needsInteraction) {
                    return `${container.interactionHint}\n`
                } else return `\n${container.description}\n`
            }
            if (!item && !container && noun.length) throw new Error("Item doesn't exist.\n");
            if (!container?.isInspected && noun.length) throw new Error(`You can't see any ${fullNoun(0).toLowerCase()} here!\n`);
            if (item) return `\n${item?.description}\n`;
            break;
        case "INSPECT":
            if (!noun.length) throw new Error("Inspect what?\n")
            if (!containerInRoom && fullNoun(0) === container?.name) throw new Error(`There is no ${container.name.toLowerCase()} in this room.\n`)
            if (container?.name === fullNoun(0)) {
                container.isInspected = true;
                if (container.needsInteraction) {
                    return `${container.interactionHint}\n`
                } else return `\n${container.description}\n`
            }
            if (!item && !container) throw new Error("Item doesn't exist.\n")
            if (!container.isInspected) throw new Error(`You can't see any ${fullNoun(0).toLowerCase()} here!\n`);
            if (item) return `\n${item.description}\n`
            break;
        case "INVENTORY":
            return player.getInventory();
        case "TAKE":
            const itemInItsContainer = container?.items.includes(item);
            const itemOnTheFloor = player.currentLocation.contains.includes(item);
            
            if (!noun.length) throw new Error("Take what?\n");
            if (!item && !container) throw new Error("Item doesn't exist.\n")
            if ((itemInItsContainer && !container.isInspected) || (itemInItsContainer && container.needsInteraction)) throw new Error(`You can't see any ${fullNoun(0).toLowerCase()} here!\n`)
            if (item?.weight && player.inventoryWeight + item?.weight <= 4) {
                player.inventory.push(item);
                if (itemOnTheFloor) player.currentLocation.contains.splice(player.currentLocation.contains.indexOf(item), 1);
                if (itemInItsContainer) container.items.splice(container.items.indexOf(item), 1);
                return `You pick up the ${item.name.toLowerCase()}.\n`;

            } else throw new Error(`You can't pick up this item. ${(fullNoun(0) !== container?.name) ? "\nTry clearing some inventory space first.\n" : ''}\n`)
        case "DROP":
            const hasItem = player.inventory.includes(item)
            if (!noun.length || !item) throw new Error("Drop what?\n");
            if (!hasItem) throw new Error(`You don't have a ${item.name.toLowerCase()} in your inventory!\n`)
                player.inventory.splice(player.inventory.indexOf(item), 1);
            player.currentLocation.contains.push(item);
            return `You drop the ${item.name.toLowerCase()} on the floor.\n`
        case "SHOOT":
            let noSuppressor = '';
            if (!player.inventory.some(item => item.name === "OLD PISTOL")) throw new Error("You don't have a gun.\n");
            if (!noun.length) throw new Error("Shoot what?\n");
            if (fullNoun(0) !== "GUARD") throw new Error(`You cannot shoot the ${fullNoun(0).toLowerCase()}!\n`);
            if (![5, 6].includes(player.currentLocation.position)) throw new Error(`There is no guard here...\n`);
            if (!player.findItem("OLD PISTOL").suppressorAttached && hostageTimer !== 40) {
                player.panicAlarm = true;
                setHostageTimer(40);
                noSuppressor = "\nWithout the suppressor, the CCTV guard has triggered the panic alarm—hostage compliance is breaking down, and the timer has dropped to 40 seconds.\n"
            }
            if (!player.guardAlive) player.cctvGuardAlive = false;
            player.guardAlive = false;
            let output = `\nYou shoot the guard with the old pistol and he drops dead on the floor. \n${noSuppressor ? noSuppressor : ''}`
            return output;
        case "THREATEN":
            if (!noun.length) throw new Error("Threaten what?");
            if (fullNoun(0) !== "HOSTAGES") throw new Error(`Invalid option.`);
            if (player.currentLocation.position !== 9) throw new Error(`There are no hostages here...\nGo to the lobby.`);
            setHostageTimer(player.panicAlarm ? 40 : 60)
            // if (player.findItem("OLD PISTOL").suppressorAttached) player.setHostageTimer(60); else player.setHostageTimer(40)
            return "The hostages cower in fear, their whimpers silenced for now. You've bought yourself some time, but their nerves won't hold forever—stay sharp.\n";
        case "ATTACH":
            if (!noun.length) throw new Error("Attach what?\n")
            if (fullNoun(0) !== "SUPPRESSOR") throw new Error("Invalid option.\n");
            if (!player.inventory.some(item => item.name === "SUPPRESSOR")) throw new Error("There is no suppressor in your inventory!\n")
            if (!player.inventory.some(item => item.name === "OLD PISTOL")) throw new Error("You have no pistol to attach this to.\n")
            player.findItem("OLD PISTOL").suppressorAttached = true;
            player.inventory.splice(player.inventory.indexOf(player.findItem("")), 1);
            return "You attach the suppressor to the old pistol.\n";
        case "USE":
            if (!noun.length) throw new Error("Use what?\n");
            if (!["VAULT DRILL", "HACKING DEVICE"].includes(fullNoun(0))) throw new Error("Invalid option.\n");
            if (!player.inventory.some(item => ["VAULT DRILL", "HACKING DEVICE"].includes(item.name))) throw new Error("This item is not in your inventory!\n");
            if (player.currentLocation.position !== 4) throw new Error("This item can only be used in the Vault Room.\n");
            // if (fullNoun(0) === "VAULT DRILL") player.setShowDrillGame(true);
            if (fullNoun(0) === "HACKING DEVICE") {
                setShowHackingGame(true);
                return ""
            }
        case "MAP":
            if (!noun.length && !unknownWord) {
                setShowMap(true);
                return "";
            }
        case "COMMANDS":
        case "HELP":
            if (!noun.length && !unknownWord) {
                setShowGuide(true);
                return "";
            }
        default: throw new Error("What?\n")
    }
}