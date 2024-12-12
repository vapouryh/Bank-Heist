import React, { useState, useEffect } from 'react';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(800); // Initial time in centiseconds

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(prevTime => prevTime - 1);
      } else {
        clearInterval(intervalId);
        // Handle timer completion (e.g., show a message, trigger an action)
      }
    }, 10); // Update every 10 milliseconds for hundredths of a second

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const seconds = Math.floor(timeLeft / 100);
  const centiseconds = timeLeft % 100;

  return (
    <div>
      {seconds}:{centiseconds.toString().padStart(2, '0')}
    </div>
  );
}

export default CountdownTimer;