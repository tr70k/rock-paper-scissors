import React, {useState} from 'react';
import './App.css';
import { Game } from './components/Game';
import { ICONS, ITEM_TYPES, ItemType } from './components/utils';

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [guess, setGuess] = useState<ItemType | null>(null)

  return (
    <div className="App">
      <div className="Header">
        Your guess:
        <div>
          {
            Object.values(ITEM_TYPES).map((itemType) => (
              <label key={itemType}>
                <input type="radio" name="guess" value={itemType} disabled={isRunning} onClick={() => setGuess(itemType)} />
                {ICONS[itemType]}
              </label>
            ))
          }
        </div>
        <button onClick={() => setIsRunning(!isRunning)} disabled={!guess}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>
      {isRunning && <Game guess={guess} />}
    </div>
  );
}

export default App;
