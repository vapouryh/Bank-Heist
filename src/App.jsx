import { useState, useEffect, useRef } from 'react';
import { initGame, handleUserInput, getLocations } from './utils/logic/game.js';
import Interface from './components/Interface';
import HackingGame from './components/HackingGame'
import GameOver from './components/GameOver';
import LoadingScreen from './components/LoadingScreen';
import CountdownTimer from './components/CountdownTimer';
import Map from './components/Map';
import Guide from './components/Guide';

import './App.css'

const App = () => {

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [showHackingGame, setShowHackingGame] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [hostageTimer, setHostageTimer] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [consoleTextContent, setConsoleTextContent] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [finalInput, setFinalInput] = useState('');
  const initRef = useRef(false);
  const inputHandledRef = useRef(false);

  const getBackgroundImage = (location) => {
    return `url('images/${location}.webp')`;
  };

  getLocations().forEach((location) => {
    const img = new Image();
    img.src = `images/${location.name}.webp`;
  });

  useEffect(() => {

    if (!initRef.current) {
      const [initLocation, initOutput] = initGame(hostageTimer, setHostageTimer, setShowHackingGame);
      setConsoleTextContent(`${initOutput}\n`);
      setCurrentLocation(initLocation);
      setTimerRunning(true);
      initRef.current = true;
    }
    if (finalInput && !inputHandledRef.current) {
      try {
        const [location, output] = handleUserInput(finalInput, setDisableInput, setShowGameOver, vaultUnlocked)
        setCurrentLocation(location)
        setConsoleTextContent((prevText) => `${prevText} > ${finalInput}\n${output}\n`)
        setFinalInput('')
      } catch (error) {
        setConsoleTextContent((prevText => `${prevText} > ${finalInput}\n${error.message}\n`))
        console.error(error)
      }
      inputHandledRef.current = true;
    }

    return () => {
      inputHandledRef.current = false;
    };
  }, [finalInput]);

  const handleTimerEnd = () => {
    if (initRef.current) {
      setShowGameOver(true);
      setDisableInput(true);
    };
  }

  return (
    <>
      {showLoadingScreen && <LoadingScreen setShowLoadingScreen={setShowLoadingScreen}/>}
      <div id="background" style={{backgroundImage: getBackgroundImage(currentLocation), transition: 'background-image 0.5s ease-in-out'}}></div>
      <div id="content" style={{filter: showHackingGame || showGameOver ? 'blur(8px)' : 'none'}}>
        <div id="header">
          <h2 className='header-item'>LOCATION: <span className="header-item-value">{currentLocation}</span></h2>
          <h2 className='header-item'>HOSTAGE TIMER:&nbsp;
            <span className="header-item-value">
              {!disableInput && !showLoadingScreen && !showHackingGame && !vaultUnlocked ? 
                <CountdownTimer 
                  initialTime={hostageTimer}
                  isRunning={timerRunning}
                  onTimerEnd={handleTimerEnd}
                  setHostageTimer={setHostageTimer}
                />
                : "00:00"
              }
            </span>
          </h2>
        </div>
        <Interface 
          consoleTextContent={consoleTextContent}
          setFinalInput={setFinalInput}
          disableInput={disableInput}
          gameOver={showGameOver}
        />
        <p id="credits">Made by <a href='https://github.com/vapouryh' target="_blank">Noah Beckman</a> - 2024  •  <a onClick={setShowMap}>SHOW MAP</a>  •  <a onClick={setShowGuide}>SHOW GUIDE</a></p>
      </div>
      {showHackingGame && <HackingGame setVaultUnlocked={setVaultUnlocked} setShowGameOver={setShowGameOver} setShowHackingGame={setShowHackingGame} setDisableInput={setDisableInput}/>}
      {showGameOver && <GameOver />}
      {showMap && <Map setShowMap={setShowMap}/>}
      {showGuide && <Guide setShowGuide={setShowGuide}/>}
    </>
  )
}

export default App