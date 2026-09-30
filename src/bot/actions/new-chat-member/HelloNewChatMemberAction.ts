import type { Chat, User as TgUser } from "grammy/types"
import { DEV_ID } from "../../../consts/env"
import { NEWBIE_TIME } from "../../../consts/time"
import BalanceService from "../../../db/services/money/BalanceService"
import SettingValueService from "../../../db/services/settings/SettingValueService"
import UserService from "../../../db/services/user/UserService"
import { hasHelloButtonSetting } from "../../../resources/settings/chat"
import type { NewChatMemberActionOptions } from "../../../types/action-options"
import type { BotContext } from "../../../types/bot"
import MessageUtils from "../../../utils/bot/MessageUtils"
import TimeUtils from "../../../utils/time/TimeUtils"
import NewChatMemberAction from "../base/NewChatMemberAction"
import type User from "../../../db/entities/user/User"
import Logger from "../../../utils/logs/Logger"

type BaseHelloOptions = {
    ctx: BotContext
    user: User | undefined
    chat: Chat
}

type HelloOldOptions =
    & BaseHelloOptions
    & {
        id: number
        chatId: number
        from: TgUser
    }

type HelloNewOptions =
    & BaseHelloOptions
    & {
        hello: string | undefined
        hasButton: boolean
    }

export default class HelloNewChatMemberAction extends NewChatMemberAction {
    private async _helloOld({
        id,
        from,
        chatId,
        ctx,
        user,
        chat
    }: HelloOldOptions): Promise<void> {
        const balance = id == from.id ?
            await ctx.vars.balance.get() :
            (await BalanceService.getUserBalance(chatId, from.id))
        const money = balance?.total ?? 0

        await MessageUtils.reply(
            ctx,
            'hello/old-user',
            {
                vars: {
                    user,
                    chat,
                    DEV_ID,
                    money
                }
            }
        )
    }

    private async _helloNew(options: HelloNewOptions): Promise<void> {
        const {
            ctx,
            hello,
            user,
            chat,
            hasButton
        } = options

        Logger.debug(
            'HelloNewChatMemberAction._helloNew',
            options
        )
        await MessageUtils.reply(
            ctx,
            'hello/new-user',
            {
                vars: {
                    hello,
                    user,
                    chat,
                    DEV_ID,
                    hasButton,
                }
            }
        )
    }

    private async _hasHelloButton(chatId: number): Promise<boolean> {
        const hasButtonSettingValue = await SettingValueService.get({
            setting: hasHelloButtonSetting,
            id: chatId
        })

        const hasButton = hasButtonSettingValue.value
        return hasButton
    }

    private _isOld(user: User | undefined): boolean {
        return TimeUtils.isExpired(
            +(user?.createdAt ?? Date.now()),
            NEWBIE_TIME
        )
    }

    override async execute(options: NewChatMemberActionOptions): Promise<void> {
        const {
            ctx,
            chatId,
            id,
            users
        } = options

        const chat = ctx.chat
        const varsChat = await ctx.vars.chat.get()
        const hello = varsChat?.hello
        const hasButton = await this._hasHelloButton(chatId)

        for (const from of users) {
            const user = (
                id == from.id ?
                    await ctx.vars.user.get() :
                    await UserService.get(chatId, from.id)
            ) ?? await UserService.defaultCreate(
                chatId,
                from.id,
                from
            )

            const isOld = this._isOld(user)

            if (isOld) {
                await this._helloOld({
                    id,
                    from,
                    chatId,
                    ctx,
                    user,
                    chat
                })
            }
            else {
                await this._helloNew({
                    ctx,
                    user,
                    chat,
                    hello,
                    hasButton
                })
            }
        }
    }
}