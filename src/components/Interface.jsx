import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types';

function Interface({ consoleTextContent, setFinalInput, disableInput, gameOver }) {

  Interface.propTypes = {
    consoleTextContent: PropTypes.string.isRequired,
    setFinalInput: PropTypes.func.isRequired,
    disableInput: PropTypes.bool.isRequired,
    gameOver: PropTypes.bool.isRequired
  }

  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const fullText = "Input command...";
  const speed = 200; // Speed for typing (milliseconds per character)
  const waitTime = 3000; // Wait time before restarting (milliseconds)

  useEffect(() => {
    let i = 0; // Index to track the current character
    let isTyping = true; // Flag to indicate typing state
  
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        // Set the entire placeholder with the current substring
        setInputPlaceholder(fullText.substring(0, i + 1));
        i++;
      } else {
        if (isTyping) {
          isTyping = false; // Ensure reset happens only once
          setTimeout(() => {
            // Reset placeholder and start again after a wait
            setInputPlaceholder("");
            i = 0; // Reset index
            isTyping = true; // Reset typing state
          }, waitTime);
        }
      }
    }, speed);
  
    return () => clearInterval(typingInterval); // Cleanup interval
  }, []); // Empty dependency array to run once

  const [userInput, setUserInput] = useState('');
  const consoleRef = useRef(null)

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        if (consoleTextContent !== null) {
            console.log(`Enter key pressed. User Input: ${userInput}`)
            setFinalInput(userInput)
            setUserInput('')
        }
    }

  }
  
  useEffect(() => {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [consoleTextContent]);
    
  return (
    <>
      <div id="content">
        <div id="console" ref={consoleRef}>{consoleTextContent}</div>
        <div id="input-container">
          <input 
            id="input" 
            type="text" 
            placeholder={disableInput ? "Game over..." : inputPlaceholder} 
            value={userInput} 
            onKeyDown={handleKeyDown} 
            onChange={handleInputChange}
            disabled={disableInput}
          />
          {/* <span id="input-symbol">&gt;</span> */}
        </div>
      </div>
    </>
  )
}

export default Interface