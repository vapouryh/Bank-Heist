import React, {useState, useEffect, useRef} from 'react'
import parser from './utils/parser/parser.js'

function Interface() {

  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const fullText = "Welcome to Bank Heist...";
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

  const [userInput, setUserInput] = useState('')
  const [consoleTextContent, setConsoleTextContent] = useState('')
  const consoleRef = useRef(null)

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        if (consoleTextContent !== null) {
            console.log(consoleTextContent)
            console.log('Enter key pressed')
            console.log(userInput)
            let parseOutput = parser.parse(userInput)
            setConsoleTextContent((prevTextContent) => `${prevTextContent} ${userInput} \n ${parseOutput.toString()} \n\n`)
            // console.log(consoleTextContent)
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
                    placeholder={inputPlaceholder} 
                    value={userInput} 
                    onKeyDown={handleKeyDown} 
                    onChange={handleInputChange}
                />
                <span id="input-symbol">&gt;</span>
            </div>
        </div>
    </>
  )
}

export default Interface