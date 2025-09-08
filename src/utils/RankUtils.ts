import { DEFAULT_USER_NAME_CAPITAL, DEV_ID } from './values/consts'

type BaseCanUseOptions = {
    id?: number
    isCreator?: boolean
}

type CanUseOptions = BaseCanUseOptions & {
    userRank: number
    adminRank?: number
}

type CanAdminUseOptions = CanUseOptions & {
    replyRank: number
}

export default class RankUtils {
    private static _wrongRankName = 'HH'
    private static _wrongRankEmoji = '❓'

    private static _rankNames = [
        'Гнида',
        'Гадина',
        'Утырок',
        'Проказник',
        'Негодник',
        'Шалун'
    ]

    private static _rankEmoji = [
        '👑',
        '⭐️',
        '🤑',
        '😎',
        '🤘',
        '👍'
    ]

    private static _ranksNames = [
        'Гниды',
        'Гадины',
        'Утырки',
        'Проказники',
        'Негодники',
        'Шалунишки'
    ]

    private static _canUse(
        {
            isCreator,
            id
        }: BaseCanUseOptions,
        value: boolean
    ) {
        return value || isCreator || id == DEV_ID
    }

    static min = 0
    static max = this._rankNames.length - 1

    static admin = this.max - 1
    static moderator = this.max - 2
    
    static isRankInBounds(rank: number): boolean {
        return rank <= RankUtils.max && rank >= RankUtils.min
    }

    static getAdminStatusByNumber(rank: number): string {
        if(rank >= this.max) return 'Создатель'
        else if(rank >= this.admin) return 'Администратор'
        else return DEFAULT_USER_NAME_CAPITAL
    }

    static getRankByNumber(rank: number): string {
        return this._rankNames[this._rankNames.length - rank - 1] ?? this._wrongRankName
    }

    static getRanksByNumber(rank: number): string {
        return this._ranksNames[this._ranksNames.length - rank - 1] ?? this._wrongRankName
    }

    static getEmojiByRank(rank: number): string {
        return this._rankEmoji[this._rankEmoji.length - rank - 1] ?? this._wrongRankEmoji
    }

    static canUse(options: CanUseOptions): boolean {
        const {userRank, adminRank} = options
        return this._canUse(options, userRank >= (adminRank ?? this.admin))
    }

    static canAdminUse(options: CanAdminUseOptions): boolean {
        const {userRank, adminRank, replyRank} = options
        return this._canUse(options, userRank >= (adminRank ?? this.admin) && replyRank < userRank)
    }
}