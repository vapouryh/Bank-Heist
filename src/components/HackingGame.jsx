import { useState, useEffect } from 'react';
import './HackingGame.css';
import CountdownTimer from './CountDownTimer';

const randomIntArrayInRange = (min, max, n = 1) => {
  if (n > max - min + 1) {
    throw new Error("n cannot be greater than the range size");
  }

  const numbers = new Set();

  while (numbers.size < n) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }

  return Array.from(numbers).sort();
};

const puzzleArray = randomIntArrayInRange(1, 9, 5);

function HackingGame({ setShowGameOver, setShowHackingGame }) {
  const [flash, setFlash] = useState(false); // Tracks if tiles should be flashing
  const [flashingComplete, setFlashingComplete] = useState(false); // Tracks if flashing is complete
  const [clickedSquares, setClickedSquares] = useState([]); // Tracks squares clicked by the user
  const [message, setMessage] = useState(""); // Success or failure message
  const [timerRunning, setTimerRunning] = useState(false); // Tracks the timer's active state

  // Flash the tiles at the start
  useEffect(() => {
    let flashCount = 0;

    const interval = setInterval(() => {
      setFlash((prevFlash) => !prevFlash); // Toggle flash state
      flashCount++;

      if (flashCount >= 6) { // 3 full flashes (on and off counts as 2)
        clearInterval(interval);
        setFlash(false);
        setFlashingComplete(true); // Mark flashing as complete
        setTimerRunning(true); // Start the timer
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleSquareClick = (index) => {
    if (!flashingComplete || clickedSquares.includes(index)) return;

    const newClickedSquares = [...clickedSquares, index];
    setClickedSquares(newClickedSquares.sort());

    if (
      newClickedSquares.length === puzzleArray.length &&
      newClickedSquares.every((val, i) => val === puzzleArray[i])
    ) {
      setTimerRunning(false);
      console.log("Puzzle Success")
      setMessage("Success! You replicated the pattern!");
    }
  };

  const handleTimerEnd = () => {
    if (clickedSquares.length !== puzzleArray.length) {
      console.log("Puzzle Failed")
      setTimeout (() => setShowHackingGame(false), 3000);
      setTimeout (() => setShowGameOver(true), 3000);
      setMessage("Time's up! You failed to replicate the pattern.");
    }
    setTimerRunning(false);
  };

  return (
    <div id="hacking-game">
      <p id="filename">{"//user/files/hack.exe"}</p>
      {!flashingComplete && <p>Memorize the pattern!</p>}
      {flashingComplete && (
        <span id="hacking-timer">
          <CountdownTimer
            initialTime={3}
            isRunning={timerRunning}
            onTimerEnd={handleTimerEnd}
          />
        </span>
      )}
      <div id="grid-container">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            onClick={() => handleSquareClick(index + 1)}
            style={{
              backgroundColor:
                puzzleArray.includes(index + 1) && flash
                  ? "#00d5ff"
                  : clickedSquares.includes(index + 1)
                  ? "#00d5ff"
                  : "grey",
              cursor: flashingComplete ? "pointer" : "default",
            }}
            className="square"
          ></div>
        ))}
      </div>
      {message && <p id="message">{message}</p>}
    </div>
  );
}

export default HackingGame;