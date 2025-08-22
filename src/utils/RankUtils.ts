import { DEFAULT_USER_NAME_CAPITAL } from './values/consts'

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

    static min = 0
    static max = this._rankNames.length - 1

    static admin = this.max - 1
    static moderator = this.max - 2
    
    static isRankInBounds(rank: number): boolean {
        return rank <= RankUtils.max && rank >= RankUtils.min
    }

    static getDevStatusByNumber(rank: number): string {
        if(rank >= this.admin) return 'Разработчик'
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

    static canUse(userRank: number, replyRank: number, adminRank: number = this.admin): boolean {
        return (userRank >= adminRank && replyRank < userRank)
    }
}