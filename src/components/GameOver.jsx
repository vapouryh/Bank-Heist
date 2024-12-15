import './GameOver.css';

function GameOver() {
  function refreshPage() {
    window.location.reload();
  }

  return (
    <>
      <div id="container">
        <h1>GAME OVER</h1>
        <button onClick={refreshPage}>PLAY AGAIN</button>
      </div>
    </>
  );
}

export default GameOver;
