import './LoadingScreen.css';
import PropTypes from 'prop-types';

function LoadingScreen({ setShowLoadingScreen }) {
  LoadingScreen.propTypes = {
    setShowLoadingScreen: PropTypes.func.isRequired,
  };

  const hideLoadingScreen = () => {
    setShowLoadingScreen(false);
  };

  return (
    <>
      <div id="loading-screen"></div>
      <div id="container">
        <h1>WELCOME TO BANK HEIST</h1>
        <button onClick={hideLoadingScreen}>PLAY GAME</button>
      </div>
    </>
  );
}

export default LoadingScreen;
