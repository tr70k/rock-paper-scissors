import { useCallback, useEffect, useState } from 'react';
import {
  FIELD_SIZE,
  ICONS,
  ITEM_SIZE,
  ITEM_TYPES,
  ITEMS_COUNT,
  TICK_DELAY,
  generateItems,
  getWinnerType,
  randomMove,
  shuffle,
  ItemType,
} from './utils';

const useGame = () => {
  const [items, setItems] = useState(() => {
    const randomItems = [
      ...generateItems(ITEM_TYPES.ROCK, ITEMS_COUNT),
      ...generateItems(ITEM_TYPES.PAPER, ITEMS_COUNT),
      ...generateItems(ITEM_TYPES.SCISSORS, ITEMS_COUNT),
    ]
    return shuffle(randomItems)
  })

  const tick = useCallback(() => {
    setItems((items) => {
      let updatedItems = [...items]

      for (let i = 0; i < updatedItems.length; i++) {
        updatedItems[i] = {
          ...updatedItems[i],
          position: randomMove(updatedItems[i].position)
        }

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
  }, [])

  useEffect(() => {
    setTimeout(tick, TICK_DELAY)
  }, [tick])

  return {
    items
  }
}

type Props = {
  guess?: ItemType | null
}

export const Game = ({ guess }: Props) => {
  const { items } = useGame()

  const rockCount = items.filter(({ type }) => type === ITEM_TYPES.ROCK).length
  const paperCount = items.filter(({ type }) => type === ITEM_TYPES.PAPER).length
  const scissorsCount = items.length - rockCount - paperCount

  const isRockWinner = rockCount === ITEMS_COUNT * 3
  const isPaperWinner = paperCount === ITEMS_COUNT * 3
  const isScissorsWinner = scissorsCount === ITEMS_COUNT * 3

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
            <b>{items[0].type === guess ? 'You win! =)' : 'You lose! =('}</b>
          ) : (
            'Waiting for result...'
          )
        }
      </div>
      <div
        className="Wrapper"
        style={{
          padding: ITEM_SIZE,
        }}
      >
        <div
          className="Field"
          style={{
            height: FIELD_SIZE,
            width: FIELD_SIZE,
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
