import { DEFAULT_USER_NAME, DEFAULT_USER_NAME_CAPITAL } from './consts'

export default class RankUtils {
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

    static adminRank = 4
    static minRank = 0
    static maxRank = this._rankNames.length - 1

    static isRankInBounds(rank: number): boolean {
        return rank <= RankUtils.maxRank && rank >= RankUtils.minRank
    }

    static getDevStatusByNumber(rank: number): string {
        if(rank >= this.adminRank) return 'Разработчик'
        else return DEFAULT_USER_NAME_CAPITAL
    }

    static getRankByNumber(rank: number): string {
        return this._rankNames[this._rankNames.length - rank - 1] ?? 'НН'
    }

    static getRanksByNumber(rank: number): string {
        return this._ranksNames[this._ranksNames.length - rank - 1] ?? 'НН'
    }

    static getEmojiByRank(rank: number): string {
        return this._rankEmoji[this._rankEmoji.length - rank - 1] ?? ''
    }

    static canUse(userRank: number, replyRank: number, adminRank: number = this.adminRank): boolean {
        return (userRank >= adminRank && replyRank < userRank)
    }
}