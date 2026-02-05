import { configDotenv } from 'dotenv'
import { env } from 'process'
import { ConstSymbol, ModeTypes, TotalCountMode } from './types/types'
import { TelegramEmoji } from 'telegraf/types'

configDotenv()

const fromEnvToNumber = (key: string) =>
    !env[key] || isNaN(+env[key]) ? undefined : +env[key]

export const DB_NAME = env.DB_NAME!
export const DB_URL = env.DB_URL!

export const DB_USERNAME = env.DB_USERNAME
export const DB_PASSWORD = env.DB_PASSWORD

export const TOKEN = env.BOT_TOKEN!
export const CHAT_ID = fromEnvToNumber('CHAT_ID')
export const DEV_ID = fromEnvToNumber('DEV_ID')

export const HTTP_PROXY = env.HTTP_PROXY

export const MODE: ModeTypes = env.MODE == 'dev' || env.MODE == 'prod' ? env.MODE : 'dev'
export const ALLOWED_CHATS = [
    ...(
        env.ALLOWED_CHATS
            ?.split(',')
            .map(v => +(v.trim()))
        ?? []
    ),
    ...(
        CHAT_ID ? [CHAT_ID] : []
    )
]

export const DOMAIN = env.DOMAIN!
export const HOOK_PORT = fromEnvToNumber('HOOK_PORT')
export const SECRET_TOKEN = env.SECRET_TOKEN
export const SECRET_PATH = env.SECRET_PATH

export const FIRST_INDEX = 0
export const NOT_FOUND_INDEX = -1

export const MAX_NAME_LENGTH = 48
export const MAX_DESCRIPTION_LENGTH = 256
export const MAX_MESSAGE_LENGTH = 4096

export const START_MONEY = 50
export const CASINO_PLUS_BOOST = 2

export const JACKPOT_PRIZE = 10
export const WIN_PRIZE = 5
export const LOSE_PRIZE = -1

export const MILLISECONDS_IN_SECOND = 1000
export const SECONDS_IN_MINUTE = 60
export const MINUTES_IN_HOUR = 60
export const HOURS_IN_DAY = 24
export const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR
export const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * HOURS_IN_DAY

export const PARSE_MODE = 'HTML'
export const INFINITY_SYMB = '♾️'
export const KICK_TIME = 31_000

export const CASINO_TIME = 1750
export const DICE_TIME = 3500
export const DARTS_TIME = 3000
export const RESTART_TIME = 5 * MILLISECONDS_IN_SECOND

export const RANDOM_PRIZE_CHANCE = 0.01
export const MIN_RANDOM_PRIZE = 0
export const MAX_RANDOM_PRIZE = 50
export const EXTRA_RANDOM_PRIZE = 100
export const EXTRA_RANDOM_NUMBER = 1

export const MIN_WORK = 15
export const MAX_WORK = 60
export const CATALOG_BOOST = 3

export const WORK_TIME = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 3
export const COOKIE_WORK_TIME = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * -10
export const STAR_TO_COIN = 100

export const DEFAULT_USER_NAME = 'игрок'
export const DEFAULT_USER_NAME_CAPITAL = DEFAULT_USER_NAME
    .replace(
        DEFAULT_USER_NAME[FIRST_INDEX],
        DEFAULT_USER_NAME[FIRST_INDEX].toUpperCase()
    )

export const MAX_MESSAGES_PER_TIME = 7
export const NOT_SPAM_TIME = MAX_MESSAGES_PER_TIME * 2

export const VOTE_TIME = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * 3
export const MONEY_DROP_TIME = 2500
export const LEVEL_BOOST = 7.5

export const BAD_COOKIE_CHANCE = 0.15
export const MAX_SHOP_PRECENTS = 100

export const COMMANDS_PER_PAGE = 5

export const DICE_ANSWER_CHANCE = 10
export const LEVEL_UP_MONEY = 4

export const DATA_REPLACEABLE_SYMBOL = '@'
export const MAX_DEBT = 500
export const MAX_SHOP_COUNT = 50000

export const ROULETTE_CHANCE = 1 / 6
export const DEFAULT_FILTER_LENGTH = 15

export const DAYS_IN_MONTH = 28
export const MILLISECONDS_IN_MONTH = MILLISECONDS_IN_DAY * DAYS_IN_MONTH
export const MAX_MONTHS_PER_BUY = 24

export const DEV_PREMIUM_PRICE_PER_MONTH = 1
export const PREMIUM_PRICE_PER_MONTH = MODE == 'dev' ? DEV_PREMIUM_PRICE_PER_MONTH : 75
export const SAVE_COOLDOWN = MODE == 'dev' ? 1 : MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * 30
export const MAX_STATS_SYMBOLS_COUNT = 5

export const DUEL_PRICE_PER_LEVEL = 50
export const MAX_GREED_BOX = 1_000_000
export const MAX_BUTTONS_PER_PAGE = 5

export const MIN_STEPS_FOR_LEVEL_IN_DUEL = 15

export const INVULNERABLE_SKILL_NAME = 'invulnerable'
export const DEFEND_SKILL_NAME = 'defend'
export const DAMAGE_UP_SKILL_NAME = 'damageup'
export const SKIP_DAMAGE_SKILL_NAME = 'skip-damage'
export const SKIP_SKILL_SKILL_NAME = 'skip-skill'
export const ZERO_SKILL_SKILL_NAME = 'zero-skill'
export const REVERSE_SKILL_NAME = 'reverse-skill'
export const CLONE_SKILL_NAME = 'clone'
export const ATTACK_SKILL_NAME_PART = 'attack'

export const HP_SYMBOLS: ConstSymbol<'❤️', '❣️', '💀'> = {
    full: '❤️',
    half: '❣️',
    empty: '💀'
}

export const MANA_SYMBOLS: ConstSymbol<'🔷', '🔹', '✖️'> = {
    full: '🔷',
    half: '🔹',
    empty: '✖️'
}

export const DEFAULT_DESCRIPTION = ''
export const DEFAULT_MAX_COUNT = 100_000
export const DEFAULT_TOTAL_COUNT = -1
export const DEFAULT_TOTAL_COUNT_MODE: TotalCountMode = 'user'
export const DEFAULT_PREMIUM_DISCOUNT = 0
export const DEFAULT_ITEMNAME = ''

export const MAX_TIME_WORD = 'навсегда'
export const DUEL_EXPERIENCE = 150
export const UNKNOWN_EFFECT = '???'

export const REACTIONS: TelegramEmoji[] = [
    '👍', '👎', '❤', '🔥', '🥰', '👏', '😁', '🤔', '🤯', '😱', 
    '🤬', '😢', '🎉', '🤩', '🤮', '💩', '🙏', '👌', '🕊', '🤡', 
    '🥱', '🥴', '😍', '🐳', '❤‍🔥', '🌚', '🌭', '💯', '🤣', '⚡', 
    '🍌', '🏆', '💔', '🤨', '😐', '🍓', '🍾', '💋', '🖕', '😈', 
    '😴', '😭', '🤓', '👻', '👨‍💻', '👀', '🎃', '🙈', '😇', '😨', 
    '🤝', '✍', '🤗', '🫡', '🎅', '🎄', '☃', '💅', '🤪', '🗿', 
    '🆒', '💘', '🙉', '🦄', '😘', '💊', '🙊', '😎', '👾', '🤷‍♂', 
    '🤷', '🤷‍♀', '😡'
]
export const REACTION_CHANCE = 0.03
export const WINSTREAK_PRIZE = 25
export const WINSTREAK_COUNT = MODE == 'dev' ? 3 : 10
export const MAX_BUTTONS_IN_HORISONTAL = 6
export const DEFAULT_MUTE_TIME = 60_000
export const DENY_NUMBER = 1

export const DENY_SYMBOL = '❌'
export const ALLOW_SYMBOL = '✅'

export const SET_STRING_PHRASE = '+s'
export const SET_NUMBER_PHRASE = '+n'

export const MAX_CARD_NAME_LENGTH = MAX_NAME_LENGTH
export const MAX_CARD_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH

export const BROADCAST_TIME = MILLISECONDS_IN_SECOND / 5
export const MIN_CARD_PRICE = 1
export const MAX_CARD_PRICE = 26_02_2025

export const UNKNOWN_CARD_TITLE = '???'
export const UNKWOWN_IMPORT_TITLE = '???'

export const FOREVER = 0
export const MAX_EXPORT_DATA_LENGTH = 2048

export const GENERATOR_INCOME_PER_HOUR = 10
export const GENERATOR_MIN_LEVEL = 1
export const GENERATOR_MAX_LEVEL = 5
export const GENERATOR_UPGRADE_PRICE_PER_LEVEL = 1000
export const GENERATOR_MAX_COUNT = 100

export const RANK_SETTINGS_TYPE = 'ranks'
export const COMMAND_ACCESS_TYPE = 'access'
export const BUTTON_ACCESS_TYPE = 'btn'
export const DEFAULT_SETTINGS_TYPE = 'chat'
export const DEFAULT_USER_SETTINGS_TYPE = 'user'
export const USER_SETTINGS_TYPES = [
    DEFAULT_USER_SETTINGS_TYPE
] as const

export const DATABASE_KEYBOARD_NAME = '#'
export const DB_KEYBOARD_EXPIRES_SECONDS = MINUTES_IN_HOUR * 2 * SECONDS_IN_MINUTE
export const CALLBACK_DATA_MAX_SIZE = 64

export const MIN_RANK_NAME_LENGTH = 1
export const MAX_RANK_NAME_LENGTH = 32

export const MIN_MARKET_PRICE = 0
export const MAX_MARKET_PRICE = MAX_CARD_PRICE

export const MAX_COUNT_BUTTONS_LENGTH = 18

export const MIN_DICE_VALUE = 1
export const MAX_DICE_VALUE = 6

export const HP_MIN_VALUE = 0