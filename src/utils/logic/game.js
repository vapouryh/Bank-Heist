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

const initGame = (setShowHackingGame, setShowMap, setShowGuide) => {
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

    player = new Player(locations, items, allContainers);
    let output = "Welcome to Bank Heist\n"
    output += "\nThe map, commands and walkthrough can be found at the bottom.\n"
    output += "Beware... this game is not for the weak.\n"
    output += player.updateLocation(14);

    return [player.currentLocation.name, output];
}


const checkGameState = (setDisableInput, setShowGameOver, setTimerRunning, hostageTimer) => {
    
    switch (player.currentLocation.position) {
      case 5:
        if (player.guardAlive) {
          let str = "\nA guard stands at the end of the corridor, and he sees you.\n"
          if (player.inventory.some(item => item.name === "OLD PISTOL")) {
            str += "\nYou have a chance to fight.\nAct quick... time is ticking! (5 seconds)\n";
            setTimeout (() => {if(player.guardAlive) setShowGameOver(true)}, 5000);
          } else {
            setDisableInput(true);
            setTimeout (() => setShowGameOver(true), 8000);
            str += "\nYou are left with nothing to defend yourself and the guard shoots you.\n";
          }
          return str;
        }
        break;
      case 6:
        if (player.panicAlarm && player.cctvGuardAlive) {
          if (player.inventory.some(item => item.name === "OLD PISTOL")) {
            setTimeout (() => {if(player.cctvGuardAlive) setShowGameOver(true)}, 5000);
            return "\nThe CCTV guard swivels in their chair, eyes locking onto you as the panic alarm fills the room.\nAct quick... time is ticking! (4 seconds)\n";
          } else {
            setDisableInput(true);
            setTimeout (() => setShowGameOver(true), 8000);
            return "\nYou are left with nothing to defend yourself and the guard shoots you.\n";
          }
        }
        if (!player.panicAlarm && player.cctvGuardAlive) return "\nThe CCTV Guard is facing the screens and doesn't see you.\n";
        break;
      case 9:
        setTimerRunning(true);
    }
    return "";
};

const handleUserInput = (input, setDisableInput, setShowGameOver, vaultUnlocked, setTimerRunning, hostageTimer, setHostageTimer, setShowHackingGame, setShowMap, setShowGuide) => {
  if (vaultUnlocked) locations[0].locked = false;
  let handledInput = handleInput(input, player, locations, hostageTimer, setHostageTimer, setShowHackingGame, setShowMap, setShowGuide)
  handledInput += checkGameState(setDisableInput, setShowGameOver, setTimerRunning, hostageTimer);

  return [player.currentLocation.name, handledInput];
};

const getLocations = () => { return locations; }

export { initGame, handleUserInput, getLocations };