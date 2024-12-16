import './Guide.css';

function Guide({ setShowGuide }) {

  const hideGuide = () => {
    setShowGuide(false);
  };

  return (
    <>
      <div id="guide">
        <button onClick={hideGuide}>CLOSE GUIDE</button>
        <p>Commands: "GO", "OPEN", "LOOK", "INSPECT", "INVENTORY", "TAKE", "DROP", "USE", "SHOOT", "THREATEN", "ATTACH"</p>
        <p>Threaten the hostages in the lobby so the timer doesn't run out.</p>
      </div>
    </>
  );
}
export default Guide;
