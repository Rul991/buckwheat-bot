import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { CubeStartButtonDataSchema, type CubeStartButtonData } from "../../../../protos/cubes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import type { BotContext } from "../../../../types/bot"
import type User from "../../../../db/entities/user/User"
import UserService from "../../../../db/services/user/UserService"
import BalanceService from "../../../../db/services/money/BalanceService"
import CubeUtils from "../../../../utils/cube/CubeUtils"
import { setTimeout } from "node:timers/promises"
import { CUBE_DROP_TIME } from "../../../../consts/time"
import GameService from "../../../../db/services/game/GameService"
import Logger from "../../../../utils/logs/Logger"

type DenyOptions = {
    ctx: BotContext
    answeredUser: User | undefined
    suggester: User | undefined
}

type SelfGameOptions = {
    ctx: BotContext
    user: User | undefined
}

type CheckBalanceOptions = {
    ctx: BotContext
    id: number
    bet: number
}

type HandleCheckBalanceOptions =
    & CheckBalanceOptions
    & {
        user: User | undefined
    }

type PlayOptions = {
    ctx: BotContext
    firstUserId: number
    secondUserId: number
    bet: number
    firstUser: User | undefined
    secondUser: User | undefined
}

type GetUserOptions = {
    ctx: BotContext
    needId: number
    id: number
}

type UserIdDice = {
    id: number
    dice: number
}

type GetWinnerLoserOptions = {
    firstUser: UserIdDice
    secondUser: UserIdDice
}

enum WinBoost {
    Draw,
    Win,
    X2
}

type GetWinnerLoserResult = {
    winner: number
    loser: number
    boost: WinBoost
}

class CubeStartButton extends CallbackQueryAction<CubeStartButtonData> {
    override schema: GenMessage<CubeStartButtonData> = CubeStartButtonDataSchema
    override defaultTextKey: string = 'cube/start-button'
    override minimumRank: number = RankUtils.min
    override settingId: number = 53
    override name: string = 'cubestrt'

    protected override async _getId(options: CallbackQueryActionOptions<CubeStartButtonData>): Promise<number | number[] | undefined> {
        const {
            data
        } = options

        const {
            first,
            second,
            isAgree,
        } = data

        if (isAgree) {
            return Number(second)
        }

        return [
            first,
            second
        ].map(v => Number(v))
    }

    protected async _selfGame({
        ctx,
        user
    }: SelfGameOptions): Promise<void> {
        await MessageUtils.reply(
            ctx,
            'cube/self-game',
            {
                vars: {
                    user
                }
            }
        )
    }

    protected async _deny({
        ctx,
        answeredUser: user,
        suggester
    }: DenyOptions): Promise<void> {
        await MessageUtils.reply(
            ctx,
            'cube/deny',
            {
                vars: {
                    user,
                    suggester
                }
            }
        )
    }

    protected async _checkBalance({
        ctx,
        id,
        bet
    }: CheckBalanceOptions): Promise<boolean> {
        const chatId = ctx.vars.chatId!
        const balance = ctx.vars.id == id ?
            await ctx.vars.balance.get() :
            await BalanceService.get(chatId, id)

        const money = balance?.total ?? 0
        const result = CubeUtils.checkBalance(bet, money)
        return result
    }

    protected async _handleCheckBalance(options: HandleCheckBalanceOptions): Promise<boolean> {
        const {
            ctx,
            user
        } = options
        const canPlay = await this._checkBalance(options)

        if (!canPlay) {
            await MessageUtils.reply(
                ctx,
                'cube/low-balance',
                {
                    vars: {
                        user
                    }
                }
            )
        }

        return canPlay
    }

    protected async _getUser({
        ctx,
        id,
        needId
    }: GetUserOptions): Promise<User | undefined> {
        const chatId = ctx.vars.chatId!
        return id == needId ? await ctx.vars.user.get() : await UserService.get(chatId, needId)
    }

    protected async _replyDice(ctx: BotContext): Promise<number> {
        const message = await MessageUtils.replyDice(
            ctx,
            '🎲'
        )
        const result = message?.dice.value ?? 2
        return result
    }

    protected _getWinnerLoser({
        firstUser,
        secondUser
    }: GetWinnerLoserOptions): GetWinnerLoserResult {
        if (firstUser.dice == secondUser.dice) return {
            winner: firstUser.id,
            loser: secondUser.id,
            boost: WinBoost.Draw
        }

        if (firstUser.dice == 1) {
            return {
                winner: firstUser.id,
                loser: secondUser.id,
                boost: WinBoost.X2
            }
        }
        else if (secondUser.dice == 1) {
            return {
                winner: secondUser.id,
                loser: firstUser.id,
                boost: WinBoost.X2
            }
        }

        const isSecondWinner = secondUser.dice > firstUser.dice
        const winner = isSecondWinner ? secondUser.id : firstUser.id
        const loser = !isSecondWinner ? secondUser.id : firstUser.id

        return {
            winner,
            loser,
            boost: WinBoost.Win
        }
    }

    protected async _play({
        ctx,
        firstUserId,
        secondUserId,
        bet,
        firstUser,
        secondUser
    }: PlayOptions): Promise<void> {
        const firstDice = await this._replyDice(ctx)
        const secondDice = await this._replyDice(ctx)
        await setTimeout(CUBE_DROP_TIME)

        const {
            winner,
            loser,
            boost
        } = this._getWinnerLoser({
            firstUser: {
                id: firstUserId,
                dice: firstDice
            },
            secondUser: {
                id: secondUserId,
                dice: secondDice
            },
        })

        const chatId = ctx.vars.chatId!
        const prize = bet * boost

        if (boost != WinBoost.Draw) {
            await BalanceService.transfer({
                chatId,
                owner: loser,
                target: winner,
                money: prize
            })
        }

        const type = 'cube'
        await Promise.allSettled([
            GameService.win({
                type,
                chatId,
                id: winner,
            }),
            GameService.lose({
                type,
                chatId,
                id: loser,
            })
        ])

        const winnerUser = winner == firstUserId ? firstUser : secondUser
        const loserUser = loser == firstUserId ? firstUser : secondUser

        await MessageUtils.reply(
            ctx,
            'cube/game-result',
            {
                vars: {
                    winner: winnerUser,
                    loser: loserUser,
                    boost,
                    prize,
                    first: {
                        user: firstUser,
                        dice: firstDice
                    },
                    second: {
                        user: secondUser,
                        dice: secondDice
                    }
                }
            }
        )

        Logger.debug(
            'CubeStartButton._play',
            {
                winnerUser,
                loserUser,
                prize,
                boost,
                firstDice,
                secondDice,
                balanceChanged: boost != WinBoost.Draw
            }
        )
    }

    protected override async _execute(options: CallbackQueryActionOptions<CubeStartButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            id,
            ctx,
            data
        } = options

        const {
            first: rawFirst,
            second: rawSecond,
            isAgree,
            bet
        } = data

        const firstUserId = Number(rawFirst)
        const secondUserId = Number(rawSecond)

        const clickedUser = await ctx.vars.user.get()
        const firstUser = await this._getUser({ ctx, id, needId: firstUserId })
        const secondUser = await this._getUser({ ctx, id, needId: secondUserId })

        if (!isAgree) {
            await MessageUtils.deleteMessages(ctx)
            return await this._deny({
                ctx,
                answeredUser: clickedUser,
                suggester: firstUser
            })
        }

        if (firstUserId == secondUserId) {
            await MessageUtils.deleteMessages(ctx)
            return await this._selfGame({
                ctx,
                user: clickedUser
            })
        }

        if (!await this._handleCheckBalance({ ctx, user: firstUser, id: firstUserId, bet })) return
        if (!await this._handleCheckBalance({ ctx, user: secondUser, id: secondUserId, bet })) return

        await MessageUtils.deleteMessages(ctx)
        await this._play({
            ctx,
            firstUserId,
            secondUserId,
            bet,
            firstUser,
            secondUser
        })
    }
}

export default new CubeStartButton()