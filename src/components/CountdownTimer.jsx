import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

function CountdownTimer({ initialTime, isRunning, onTimerEnd, setHostageTimer }) {

  CountdownTimer.propTypes = {
    initialTime: PropTypes.number.isRequired, // Time in seconds
    isRunning: PropTypes.bool.isRequired, // Whether the timer is running
    onTimerEnd: PropTypes.func.isRequired, // Callback when the timer ends
    setHostageTimer: PropTypes.func.isRequired
  };

  const [timeLeft, setTimeLeft] = useState(initialTime * 100); // Initial time in centiseconds
  const startTimeRef = useRef(null); // Store the start time
  const timerId = useRef(null); // Persistent reference for the timer ID

  useEffect(() => {
    if (!isRunning) {
      clearInterval(timerId.current);
      return;
    }

    // Start the timer
    startTimeRef.current = Date.now();
    timerId.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current; // Time elapsed in milliseconds
      const remainingTime = initialTime * 1000 - elapsed; // Remaining time in milliseconds
      if (initialTime !== 8) setHostageTimer(remainingTime / 1000);

      if (remainingTime <= 0) {
        clearInterval(timerId.current); // Clear interval when timer ends
        setTimeLeft(0);
        if (onTimerEnd) onTimerEnd(); // Call onTimerEnd if provided
      } else {
        setTimeLeft(Math.round(remainingTime / 10)); // Convert to centiseconds
      }
    }, 10); // Check every 10 milliseconds

    return () => clearInterval(timerId.current); // Cleanup on unmount
  }, [isRunning, initialTime, onTimerEnd]);

  const seconds = Math.floor(timeLeft / 100);
  const centiseconds = timeLeft % 100;
  const formattedTime = `${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;

  return (
    <>
    {formattedTime}
    </>
  );
}

export default CountdownTimer;