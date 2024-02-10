import React, {useState} from 'react';
import './App.css';
import { Game } from './components/Game';
import { ICONS, ITEM_TYPES, ItemType, Speed } from './components/utils';

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [guess, setGuess] = useState<ItemType | null>(null)
  const [speed, setSpeed] = useState<Speed>(1)
  const [count, setCount] = useState<number>(20)

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
        <div className="Header">
          Count:
          <select
            name="count"
            value={count}
            onChange={(e) => setCount(+e.target.value)}
            disabled={isRunning}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
          Speed:
          <select
            name="speed"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value as Speed)}
            disabled={isRunning}
          >
            <option value="0.5">x0.5</option>
            <option value="1">x1</option>
            <option value="1.5">x1.5</option>
            <option value="2">x2</option>
          </select>
          <button onClick={() => setIsRunning(!isRunning)} disabled={!guess}>
            {isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
      {isRunning && <Game guess={guess} speed={speed} count={count} />}
    </div>
  );
}

export default App;
