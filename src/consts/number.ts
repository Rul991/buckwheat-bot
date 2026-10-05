import { IS_PROD } from "./env"

export const MAX_DEBT_VALUE = -500
export const START_MONEY = 50
export const MAX_PERCENTS = 100

export const ROULETTE_PRIZE = 25
export const ROULETTE_PRIZE_WINSTREAK = IS_PROD ? 8 : 3
export const LEVEL_BOOST_MULTIPLIER = 0.075

export const NEED_BOSS_CLASS_CHANGES = IS_PROD ? 20 : 10
export const CHANNEL_ID = 777000

export const MAX_GREED_BOX_PRIZE = 2 ** 34
export const GREED_BOX_PRIZE = 2

export const DEAD_HEALTH = 0
export const MIN_SHIELD = 0
export const MAX_BUSINESS_STAKES = 10_000
export const MAX_CUBE_BET = 4_000_000_000

export const MIN_STARS = 1
export const MAX_STARS = 100_000

export const NO_ANTISPAM_MESSAGE_COUNT = 1