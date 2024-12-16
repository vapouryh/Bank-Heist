import './Map.css';

function Map({ setShowMap }) {

  const hideMap = () => {
    setShowMap(false);
  };

  return (
    <>
      <div id="map">
        <button onClick={hideMap}>CLOSE MAP</button>
        <img src="images/MAP.png"></img>
      </div>
    </>
  );
}
export default Map;
