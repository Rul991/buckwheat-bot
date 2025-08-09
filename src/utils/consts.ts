import { configDotenv } from 'dotenv'
import { env } from 'process'
import { ModeTypes } from './types'

configDotenv()

export const TOKEN = env.BOT_TOKEN!
export const DB_NAME = env.DB_NAME!
export const DB_URL = env.DB_URL!
export const CHAT_ID = env.CHAT_ID!
export const EMPTY_PROFILE_IMAGE = env.EMPTY_PROFILE_IMAGE
export const DEV_ID = env.DEV_ID
export const MODE: ModeTypes = env.MODE as ModeTypes ?? 'dev'

export const MAX_NAME_LENGTH = 48
export const MAX_DESCRIPTION_LENGTH = 256

export const DAILY_MONEY = 20
export const JACKPOT_PRIZE = 20
export const WIN_PRIZE = 5
export const LOSE_PRIZE = -1

export const MILLISECONDS_IN_SECOND = 1000
export const SECONDS_IN_MINUTE = 60
export const MINUTES_IN_HOUR = 60
export const HOURS_IN_DAY = 24
export const MILLISECONDS_IN_DAY = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY

export const PARSE_MODE = 'HTML'

export const CASINO_TIME = 1750
export const DICE_TIME = 3500

export const DEFAULT_USER_NAME = 'игрок'
export const DEFAULT_USER_NAME_CAPITAL = DEFAULT_USER_NAME
    .replace(
        DEFAULT_USER_NAME[0], 
        DEFAULT_USER_NAME[0].toUpperCase()
    )