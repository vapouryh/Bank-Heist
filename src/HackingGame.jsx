import React from 'react'
import './HackingGame.css'
import CountdownTimer from './CountDownTimer'

function HackingGame() {

  const grids = [1, 2, 3, 4, 5, 6]

  return (
    <div id="hacking-game">
      <p id="filename">//user/files/hack.exe</p>
      <CountdownTimer />
      <div id="grid-container">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="square"></div>
        ))}
      </div>
    </div>
  )
}

export default HackingGame