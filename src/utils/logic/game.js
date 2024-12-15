import data from './data.json';
import handleInput from './verbHandler.js';
import Player from "./player.js"
import Item from "./item.js";
import Location from './location.js';

var player;
const locations = [];
const items = [];
const allContainers = [];

var gameOver = false;

const initGame = (setShowDrillGame, setShowHackingGame) => {
    data.items.forEach(item => {
        const itemObject = new Item(
            item.name, 
            item.description, 
            item.weight,
            item.origin,
            item.suppressorAttached
        );
        items.push(itemObject);
    });
    
    data.locations.forEach(location => {
        const locationObject = new Location(
            location.name, 
            location.description, 
            location.position, 
            location.accessibleBy,
            location.locked,
            location.contains
        );
        !location.contains.length || allContainers.push(...location.contains);
        location.contains.forEach(container => {
            container.items = items.filter(item => container.items.includes(item.name))
        })
        locations[location.position] = locationObject;
    });

    player = new Player(locations, items, allContainers, setShowDrillGame, setShowHackingGame);
    let output = "Welcome to Bank Heist\n"
    output += player.updateLocation(14);

    return [player.currentLocation.name, output];
}


const checkGameState = (setDisableInput, setShowGameOver) => {
    
    switch (player.currentLocation.position) {
      case 0:
        return "You've reached the end. Game Over.";
      case 5:
        if (player.guardAlive) {
          let str = "\nA guard stands at the end of the corridor, and he sees you.\n"
          if (player.inventory.some(item => item.name === "OLD PISTOL")) {
            str += "You have a chance to fight.\nAct quick... time is ticking!";
          } else {
            setDisableInput(true);
            setTimeout (() => setShowGameOver(true), 8000);
            str += "\nYou are left with nothing to defend yourself and the guard shoots you.\n";
          }
          return str;
        }
        break;
      case 6:
        if (player.hostageTimer === 20 && player.cctvGuardAlive) {
          if (player.inventory.some(item => item.name === "OLD PISTOL")) {
            return "The CCTV guard swivels in their chair, eyes locking onto you as the panic alarm fills the room.\nAct quick... time is ticking!";
          } else {
            setDisableInput(true);
            setTimeout (() => setShowGameOver(true), 8000);
            return "\nYou are left with nothing to defend yourself and the guard shoots you.\n";
          }
        }
        if (player.hostageTimer !== 20) return "The CCTV Guard is facing the screens and doesn't see you.";
        break;
    }
    return "";
};

const handleUserInput = (input, setDisableInput, setShowGameOver) => {
  let handledInput = handleInput(input, player, locations)
  handledInput += checkGameState(setDisableInput, setShowGameOver);

  return [player.currentLocation.name, handledInput];
};

export { initGame, handleUserInput };