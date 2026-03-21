import { Context } from 'telegraf'
import { DEFAULT_USER_NAME_CAPITAL, DEV_ID } from './values/consts'
import ContextUtils from './ContextUtils'

type CanAdminUseOptions = {
    replyRank: number
    userRank: number
}

export default class RankUtils {
    private static _wrongRankEmoji = '🐒'
    private static _rankEmoji = [
        '👑',
        '⭐️',
        '🤑',
        '😎',
        '🤘',
        '👍'
    ]

    static min = 0
    static unknown = this.min - 1
    static max = this._rankEmoji.length - 1

    static admin = this.max - 1
    static moderator = this.max - 2
    
    static isRankInBounds(rank: number): boolean {
        return rank <= RankUtils.max && rank >= RankUtils.min
    }

    static getAdminStatusByNumber(rank: number, id?: number): string {
        if(id && id == DEV_ID) return 'Отец'
        else if(rank >= this.max) return 'Создатель'
        else if(rank >= this.admin) return 'Администратор'
        else return DEFAULT_USER_NAME_CAPITAL
    }

    static getEmojiByRank(rank: number): string {
        return this._rankEmoji[this._rankEmoji.length - rank - 1] || this._wrongRankEmoji
    }

    static has(userRank: number, needRank: number) {
        if(needRank == RankUtils.min) return true
        return userRank >= needRank
    }

    static biggerThan(options: CanAdminUseOptions): boolean {
        const {userRank, replyRank} = options
        return userRank > replyRank
    }

    static async canUseWithoutRank(ctx: Context, id: number) {
        return DEV_ID == id || await ContextUtils.isCreator(ctx)
    }
}