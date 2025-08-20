import { configDotenv } from 'dotenv'
import { env } from 'process'
import { ModeTypes } from './types'

configDotenv()

export const TOKEN = env.BOT_TOKEN!
export const DB_NAME = env.DB_NAME!
export const DB_URL = env.DB_URL!
export const CHAT_ID = env.CHAT_ID!
export const EMPTY_PROFILE_IMAGE = env.EMPTY_PROFILE_IMAGE
export const DEV_ID = isNaN(+(env.DEV_ID ?? 0)) ? undefined : +env.DEV_ID!
export const MODE: ModeTypes = env.MODE as ModeTypes ?? 'dev'

export const MAX_NAME_LENGTH = 48
export const MAX_DESCRIPTION_LENGTH = 256
export const MAX_MESSAGE_LENGTH = 4096

export const START_MONEY = 1
export const CASINO_PLUS_BOOST = 2

export const JACKPOT_PRIZE = 10
export const WIN_PRIZE = 5
export const LOSE_PRIZE = -1

export const MILLISECONDS_IN_SECOND = 1000
export const SECONDS_IN_MINUTE = 60
export const MINUTES_IN_HOUR = 60
export const HOURS_IN_DAY = 24
export const MILLISECONDS_IN_DAY = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY

export const PARSE_MODE = 'HTML'
export const INFINITY_SYMB = '♾️'
export const KICK_TIME = 31_000

export const CASINO_TIME = 1750
export const DICE_TIME = 3500
export const RESTART_TIME = 5 * MILLISECONDS_IN_SECOND

export const RANDOM_PRIZE_CHANCE = 0.01
export const MIN_RANDOM_PRIZE = 0
export const MAX_RANDOM_PRIZE = 50
export const EXTRA_RANDOM_PRIZE = 100
export const EXTRA_RANDOM_NUMBER = 1

export const WHERE_MARRIAGE_TIME = 10000
export const WHERE_MARRIAGE_MESSAGES = 1

export const MIN_WORK = 5
export const MAX_WORK = 20
export const CATALOG_BOOST = 3

export const WORK_TIME = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 3
export const COOKIE_WORK_TIME = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * -10
export const RUBLE_TO_COIN = 1.5

export const DEFAULT_USER_NAME = 'игрок'
export const DEFAULT_USER_NAME_CAPITAL = DEFAULT_USER_NAME
    .replace(
        DEFAULT_USER_NAME[0], 
        DEFAULT_USER_NAME[0].toUpperCase()
    )

export const MAX_MESSAGES_PER_TIME = 7
export const NOT_SPAM_TIME = MILLISECONDS_IN_SECOND * MAX_MESSAGES_PER_TIME * 2
export const TAB_NEW_LINE = '\n       '

export const VOTE_TIME = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * 3