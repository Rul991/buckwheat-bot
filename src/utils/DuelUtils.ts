import { Context } from 'telegraf'
import Character from '../interfaces/duel/Character'
import Characteristics from '../interfaces/duel/Characteristics'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import MessageUtils from './MessageUtils'
import ObjectValidator from './ObjectValidator'
import { characterSchema } from './values/schemas'
import StringUtils from './StringUtils'
import { DuelEndOptions, DuelFilename, Link } from './values/types'
import Duel from '../interfaces/schemas/duels/Duel'
import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'
import DuelService from '../classes/db/services/duel/DuelService'
import AdminUtils from './AdminUtils'
import DuelistService from '../classes/db/services/duelist/DuelistService'
import { HP_SYMBOLS, MANA_SYMBOLS, MAX_STATS_SYMBOLS_COUNT } from './values/consts'

type StatsOptions = {
    ctx: Context
    chatId: number
    userId: number
    replyId: number
    isUserFirst: boolean
}

type LowOptions = {
    first: Link,
    second: Link,
    ctx: Context
    userId: number
    chatId: number
}

export default class DuelUtils {
    private static _folderPath = 'json/duels'

    private static async _sendLowMoneyMessage({ctx, first, second, userId, chatId}: LowOptions): Promise<boolean> {
        const user = await DuelService.getPriceStats(chatId, userId)
        if(user.price > user.money) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/low-money.pug',
                {
                    changeValues: {
                        first,
                        second,
                        price: StringUtils.toFormattedNumber(user.price)
                    }
                }
            )
            return false
        }

        return true
    }

    private static async _sendLowHpMessage({ctx, first, second, userId, chatId}: LowOptions): Promise<boolean> {
        const hp = (await DuelistService.getCurrentCharacteristics(chatId, userId)).hp
        if(hp <= 0) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/low-hp.pug',
                {
                    changeValues: {
                        first,
                        second
                    }
                }
            )
            return false
        }
        return true
    }

    static async sendOnDuelMessage({ctx, first, second, userId, chatId}: LowOptions): Promise<boolean> {
        const onDuel = await DuelistService.onDuel(chatId, userId)

        if(onDuel) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/reply-on-duel.pug',
                {
                    changeValues: {
                        first,
                        second
                    }
                }
            )
            return false
        }
        return true
    }

    static async getCharacterFromFile(filename: DuelFilename): Promise<Character | null> {
        const json = await FileUtils.readJsonFromResource<Character>(
            `${this._folderPath}/${filename}.json`
        )

        if(!json) return null
        if(!ObjectValidator.isValidatedObject(json, characterSchema)) 
            return null

        return json
    }

    static async getMaxCharacteristicsFromFile(filename: DuelFilename, level: number): Promise<Characteristics | null> {
        const chars = (await this.getCharacterFromFile(filename))?.characteristics
        if(!chars) return null

        const getMax = (key: keyof Characteristics) => {
            return chars.start[key] + (chars.up[key] * (level - 1))
        }
        
        return {
            hp: getMax('hp'),
            mana: getMax('mana'),
        }
    }

    static getProgress(
        current: Characteristics,
        max: Characteristics, 
        key: 'hp' | 'mana'
    ): string {
        const symbols = key == 'hp' ? HP_SYMBOLS : MANA_SYMBOLS
        return StringUtils.getProgressWithNums({
            symbols: {
                full: symbols.FULL,
                half: symbols.HALF,
                empty: symbols.EMPTY,
                maxCount: MAX_STATS_SYMBOLS_COUNT
            },
            progress: {
                current: current[key],
                max: max[key]
            }
        })
    }

    static async getParamsForFightMessage(chatId: number, duel: Duel) {
        const id = duel.step.duelist
        const enemy = this.getEnemy(duel, id)

        const getChars = async (id: number) => {
            const current = await DuelistService.getCurrentCharacteristics(chatId, id)
            const max = await DuelistService.getMaxCharacteristics(chatId, id)

            const getProgress = (
                key: keyof Characteristics
            ): string => {
                return DuelUtils.getProgress(
                    current,
                    max,
                    key
                )
            }

            return {
                mana: getProgress('mana'),
                hp: getProgress('hp')
            }
        }

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/duel/fight/fight.pug',
                {
                    changeValues: {
                        first: await ContextUtils.getUser(chatId, duel.firstDuelist),
                        second: await ContextUtils.getUser(chatId, duel.secondDuelist),
                        step: await ContextUtils.getUser(chatId, id),
                        you: await getChars(id),
                        enemy: await getChars(enemy),
                        steps: StringUtils.toFormattedNumber(duel.steps ?? 0)
                    },
                }
            ),
            keyboard: await InlineKeyboardManager.get(
                'duels/fight',
                {
                    duel: JSON.stringify({duel: duel.id}),
                    away: JSON.stringify({v: duel.id, t: 'd'})
                }
            )
        }
    }

    static async checkStatsAndSendMessage(options: StatsOptions): Promise<boolean> {
        const lowOptions = await this.getLowOptions(options)

        if(!await this._sendLowMoneyMessage(lowOptions)) return false
        if(!await this._sendLowHpMessage(lowOptions)) return false
        
        return true
    }

    static async getLowOptions({
        ctx, 
        chatId, 
        userId, 
        replyId,
        isUserFirst
    }: StatsOptions): Promise<LowOptions> {
        const userLink = await ContextUtils.getUser(chatId, userId)
        const replyLink = await ContextUtils.getUser(chatId, replyId)

        const getLink = (isUserFirst: boolean) => isUserFirst ? userLink : replyLink

        const first = getLink(isUserFirst)
        const second = getLink(!isUserFirst)
        const options = {ctx, first, second, userId, chatId}

        return options
    }

    static async showAlertIfCantUse(ctx: Context, duelId: number) {
        const id = ctx.from?.id
        if(!id) return true

        const cantUse = !(await DuelService.canUse({
            user: id,
            duel: duelId
        }))

        if(cantUse) {
            await ContextUtils.showAlertFromFile(ctx)
        }

        return cantUse
    }

    static async end(ctx: Context, options: DuelEndOptions) {
        const duelResult = await DuelService.end(options)
        if(!duelResult) return null

        const {winner, loser, prize, experience} = duelResult
        const {chatId} = options

        // await AdminUtils.kick(ctx, loser)
        await MessageUtils.deleteMessage(ctx)
        return await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/fight/end.pug',
            {
                changeValues: {
                    winner: await ContextUtils.getUser(chatId, winner),
                    loser: await ContextUtils.getUser(chatId, loser),
                    prize: StringUtils.toFormattedNumber(prize),
                    experience: {
                        first: StringUtils.toFormattedNumber(experience.first),
                        second: StringUtils.toFormattedNumber(experience.second),
                    }
                },
                isReply: false
            }
        )
    }

    static getEnemy(duel: Duel, id: number): number {
        return duel.firstDuelist == id ? duel.secondDuelist : duel.firstDuelist
    }
}