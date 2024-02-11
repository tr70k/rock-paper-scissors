export const TICK_DELAY = 100

export const ITEM_SIZE = 15
export const FIELD_SIZE = 600

export const MIN_POSITION = 0
export const MAX_POSITION = FIELD_SIZE

export const ITEM_TYPES = {
  ROCK: 'Rock',
  PAPER: 'Paper',
  SCISSORS: 'Scissors'
} as const

export type ItemTypeKey = keyof typeof ITEM_TYPES
export type ItemType = typeof ITEM_TYPES[ItemTypeKey]

export type Speed = 0.5 | 1 | 1.5 | 2

export const ICONS: Record<ItemType, string> = {
  [ITEM_TYPES.ROCK]: '🪨',
  [ITEM_TYPES.PAPER]: '✂️',
  [ITEM_TYPES.SCISSORS]: '📃',
}

export type Position = {
  x: number
  y: number
}

export type Item = {
  id: string
  type: ItemType
  position: Position
}

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(array: T[]) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const generateItems = (itemType: ItemType, count: number): Item[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: itemType + '-' + index,
    type: itemType,
    position: {
      x: getRandomInt(MIN_POSITION, MAX_POSITION),
      y: getRandomInt(MIN_POSITION, MAX_POSITION),
    }
  }))
}

export const randomMove = (position: Position, step = 2): Position => {
  return {
    x: Math.min(Math.max(position.x + getRandomInt(-ITEM_SIZE / step, ITEM_SIZE / step), MIN_POSITION), MAX_POSITION),
    y: Math.min(Math.max(position.y + getRandomInt(-ITEM_SIZE / step, ITEM_SIZE / step), MIN_POSITION), MAX_POSITION),
  }
}

export const getWinnerType = (itemTypeA: ItemType, itemTypeB: ItemType) => {
  if (
    (itemTypeA === ITEM_TYPES.ROCK && itemTypeB === ITEM_TYPES.SCISSORS) ||
    (itemTypeA === ITEM_TYPES.SCISSORS && itemTypeB === ITEM_TYPES.PAPER) ||
    (itemTypeA === ITEM_TYPES.PAPER && itemTypeB === ITEM_TYPES.ROCK)
  ) {
    return itemTypeB
  }

  return itemTypeA
}
