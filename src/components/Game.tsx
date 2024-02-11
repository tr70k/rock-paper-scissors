import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FIELD_SIZE,
  ICONS,
  ITEM_SIZE,
  ITEM_TYPES,
  TICK_DELAY,
  generateItems,
  getWinnerType,
  randomMove,
  shuffle,
  ItemType,
  Speed,
} from './utils';

const useGame = (count = 20, step = 2) => {
  const [items, setItems] = useState(() => {
    const randomItems = [
      ...generateItems(ITEM_TYPES.ROCK, count),
      ...generateItems(ITEM_TYPES.PAPER, count),
      ...generateItems(ITEM_TYPES.SCISSORS, count),
    ]
    return shuffle(randomItems)
  })

  const tick = useCallback(() => {
    setItems((items) => {
      let updatedItems = [...items]

      // move each item
      for (let i = 0; i < updatedItems.length; i++) {
        updatedItems[i] = {
          ...updatedItems[i],
          position: randomMove(updatedItems[i].position, step)
        }
      }

      // compare and update item types
      for (let i = 0; i < updatedItems.length; i++) {
        for (let j = i + 1; j < updatedItems.length; j++) {
          if (
            (Math.abs(updatedItems[i].position.x - updatedItems[j].position.x) < ITEM_SIZE) &&
            (Math.abs(updatedItems[i].position.y - updatedItems[j].position.y) < ITEM_SIZE)
          ) {
            const winnerType = getWinnerType(updatedItems[i].type, updatedItems[j].type)

            updatedItems[i] = {
              ...updatedItems[i],
              type: winnerType,
            }
            updatedItems[j] = {
              ...updatedItems[j],
              type: winnerType,
            }
          }
        }
      }

      return updatedItems
    })

    setTimeout(tick, TICK_DELAY)
  }, [step])

  useEffect(() => {
    setTimeout(tick, TICK_DELAY)
  }, [tick])

  return {
    items
  }
}

type Props = {
  guess?: ItemType | null
  speed?: Speed
  count?: number
}

export const Game = ({ guess, speed = 0.5, count = 20 }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const { items } = useGame(count, 3 - speed)

  useEffect(() => {
    function handleResize() {
      if (wrapperRef.current) {
        setScale((wrapperRef.current.getBoundingClientRect().width - ITEM_SIZE * 2) / FIELD_SIZE)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const rockCount = items.filter(({ type }) => type === ITEM_TYPES.ROCK).length
  const paperCount = items.filter(({ type }) => type === ITEM_TYPES.PAPER).length
  const scissorsCount = items.length - rockCount - paperCount

  const isRockWinner = rockCount === count * 3
  const isPaperWinner = paperCount === count * 3
  const isScissorsWinner = scissorsCount === count * 3

  return (
    <div>
      <ul>
        <li>{ICONS[ITEM_TYPES.ROCK]}: {rockCount} {isRockWinner ? '- winner!' : ''}</li>
        <li>{ICONS[ITEM_TYPES.PAPER]}: {paperCount} {isPaperWinner ? '- winner!' : ''}</li>
        <li>{ICONS[ITEM_TYPES.SCISSORS]}: {scissorsCount} {isScissorsWinner ? '- winner!' : ''}</li>
      </ul>
      <div className="Result">
        {
          isRockWinner || isPaperWinner || isScissorsWinner ? (
            items[0].type === guess ? 'You win! =)' : 'You lose! =('
          ) : (
            'Waiting for result...'
          )
        }
      </div>
      <div
        ref={wrapperRef}
        className="Wrapper"
        style={{
          padding: ITEM_SIZE,
        }}
      >
        <div
          className="Field"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {
            items.map((item) => (
              <div
                key={item.id}
                className="Item"
                style={{
                  top: item.position.y - ITEM_SIZE / 2,
                  left: item.position.x - ITEM_SIZE / 2,
                  height: ITEM_SIZE,
                  width: ITEM_SIZE,
                  fontSize: ITEM_SIZE * 1.5,
                }}
              >
                {ICONS[item.type]}
              </div>
            ))
          }
        </div>
      </div>
      <div className="Copyright">by tr70k</div>
    </div>
  )
}
