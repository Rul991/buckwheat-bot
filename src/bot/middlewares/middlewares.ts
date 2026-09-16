import { START_MONEY } from "../../consts/number"
import { UNKNOWN_TEXT } from "../../consts/texts"
import Chat from "../../db/entities/chat/Chat"
import Balance from "../../db/entities/money/Balance"
import ChatService from "../../db/services/chat/ChatService"
import LinkedChatService from "../../db/services/chat/LinkedChatService"
import DuelistService from "../../db/services/duel/DuelistService"
import LevelService from "../../db/services/level/LevelService"
import BalanceService from "../../db/services/money/BalanceService"
import UserService from "../../db/services/user/UserService"
import type { BotContext } from "../../types/bot"
import ContextUtils from "../../utils/bot/ContextUtils"
import RankUtils from "../../utils/db/RankUtils"
import Logger from "../../utils/logs/Logger"

export const updateDefaultOptions = async (ctx: BotContext) => {
    const id = ctx.from?.id
    const [
        chatId,
        chatMember,
    ] = await Promise.all([
        LinkedChatService.getCurrent(ctx, id),
        ContextUtils.getChatMember(ctx, id)
    ])
    const isOwner = Boolean(id && RankUtils.canUseWithoutRank(chatMember, id))
    const [
        user,
        chat
    ] = await Promise.all([
        chatId && id && await UserService.get(chatId, id) || undefined,
        chatId && await ChatService.create(
            new Chat({
                id: chatId,
                title: ctx.chat?.title ?? UNKNOWN_TEXT
            })
        ) || undefined
    ])

    ctx.vars = {
        ...ctx.vars,
        id,
        chatId,
        isOwner,
        user,
        chat
    }

    Logger.system('updateDefaultOptions', ctx.vars)
}

export const updateDatabaseOptions = async (ctx: BotContext) => {
    const chatId = ctx.vars.chatId
    const id = ctx.vars.id

    const [
        balance,
        level,
        duelist
    ] = await Promise.all([
        chatId && id && BalanceService.create(
            Balance.user(chatId, id, START_MONEY)
        ) || undefined,
        chatId && id && LevelService.get(chatId, id) || undefined,
        chatId && id && DuelistService.get(chatId, id) || undefined
    ])

    ctx.vars = {
        ...ctx.vars,
        balance,
        level,
        duelist
    }

    Logger.system('updateDatabaseOptions', ctx.vars)
}