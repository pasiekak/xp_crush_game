import { useState } from 'react';
import './App.css';
import Sky from './features/animated-sky/Sky';
import Game from './features/game/Game';

const App = () => {
  const [framesPerSecond, setFramesPerSecond] = useState(60);
  return (
    <div className="App">
      <Sky framesPerSecond={framesPerSecond}/>
      <Game/>
    </div>
  );
};

export default App;