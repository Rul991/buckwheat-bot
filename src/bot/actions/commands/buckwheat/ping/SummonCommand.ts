import { setTimeout } from "node:timers/promises"
import { REACT_EMOJIES } from "../../../../../consts/texts"
import type User from "../../../../../db/entities/user/User"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BotContext } from "../../../../../types/bot"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import { SUMMON_DELAY } from "../../../../../consts/time"
import type { MaybeString } from "../../../../../types/types"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import ChatService from "../../../../../db/services/chat/ChatService"
import SettingValueService from "../../../../../db/services/settings/SettingValueService"
import { summonEmojiSetting } from "../../../../../resources/settings/user"
import type SettingValue from "../../../../../db/entities/settings/SettingValue"
import type { SettingValueTypes } from "../../../../../protos/settings_pb"

type SummonOptions = {
    ctx: BotContext
    users: User[]
    other: MaybeString
    emojies: Map<number, SettingValue<"enum", SettingValueTypes.User>>
}

export default class SummonCommand extends BuckwheatCommand {
    private _usersPerMessage = 5
    override aliases: string[] = ['призвать', 'позвать', 'зов', 'мобилизация']
    override minimumRank: number = RankUtils.admin
    override settingId: number = 42
    override name: string = 'призыв'
    override filename: string = 'summon'
    override needData: boolean = true

    private async _summon({
        ctx,
        users,
        other,
        emojies
    }: SummonOptions): Promise<void> {
        const chatId = ctx.vars.chatId!
        const maxLength = Math.ceil(users.length / this._usersPerMessage)

        await ChatService.toggleCanSummon(chatId)

        for (let i = 0; i < maxLength; i++) {
            const start = i * this._usersPerMessage
            const end = start + this._usersPerMessage
            const messageUsers = users
                .slice(start, end)
                .map(user => {
                    return {
                        ...user,
                        emoji: emojies.get(user.id)?.value
                    }
                })

            await MessageUtils.reply(
                ctx,
                'summon/message',
                {
                    vars: {
                        users: messageUsers,
                        emojies: REACT_EMOJIES,
                        other
                    }
                }
            )
            await setTimeout(SUMMON_DELAY)
        }

        await ChatService.toggleCanSummon(chatId)
        await MessageUtils.reply(
            ctx,
            'summon/end'
        )
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx,
        } = options

        if (ctx.chat.type == 'private') {
            return {
                key: 'summon/private'
            }
        }

        const chat = await ctx.vars.chat.get()
        const canUseSummonNow = chat?.canUseSummonNow ?? true

        if (!canUseSummonNow) {
            return {
                key: 'summon/already-use'
            }
        }

        const users = await UserService.getAllByChatId(chatId)
        const emojies = await SettingValueService.getByIds(
            users.map(v => v.id),
            summonEmojiSetting
        )
        const message = ctx.msg
        this._summon({
            ctx,
            users,
            other: MessageEntityUtils.messageToHtml(message),
            emojies
        })
    }
}