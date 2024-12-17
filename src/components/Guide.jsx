import './Guide.css';

function Guide({ setShowGuide }) {

  const hideGuide = () => {
    setShowGuide(false);
  };

  return (
    <>
      <div id="guide">
        <button onClick={hideGuide}>CLOSE GUIDE</button>
        <h1 className='bold'>{"COMMANDS:"}</h1>
        <p>{"GO: <direction> (N|E|S|W)"}</p>
        <p>{"OPEN: <container> <tool?>"}</p>
        <p>{"LOOK: <container?>"}</p>
        <p>{"INSPECT: <container or item>"}</p>
        <p>{"INVENTORY"}</p>
        <p>{"TAKE: <item>"}</p>
        <p>{"DROP: <item>"}</p>
        <p>{"USE: <item>"}</p>
        <p>{"SHOOT: GUARD"}</p>
        <p>{"THREATEN: HOSTAGES"}</p>
        <p>{"ATTACH: SUPPRESSOR"}</p>
        <p>{"MAP: OPENS THE MAP"}</p>
        <p>{"GUIDE: OPENS THE GUIDE"}</p>
        <p></p>
        <h1 className='bold'>**Threaten the hostages in the lobby so the timer doesn't run out!**</h1>
      </div>
    </>
  );
}
export default Guide;
