import Balance from "../../db/entities/money/Balance"
import ChatService from "../../db/services/chat/ChatService"
import LinkedChatService from "../../db/services/chat/LinkedChatService"
import DuelistService from "../../db/services/duel/DuelistService"
import DuelService from "../../db/services/duel/DuelService"
import DuelStepService from "../../db/services/duel/DuelStepService"
import LevelService from "../../db/services/level/LevelService"
import BalanceService from "../../db/services/money/BalanceService"
import UserService from "../../db/services/user/UserService"
import type { BotContext } from "../../types/bot"
import ContextUtils from "../../utils/bot/ContextUtils"
import LazyValue from "../../utils/cache/LazyValue"
import RankUtils from "../../utils/db/RankUtils"
import ExperienceUtils from "../../utils/level/ExperienceUtils"

export const setContextVarsAndData = async (ctx: BotContext, next: () => Promise<void>) => {
    const id = ctx.from?.id
    if (!id) return

    const chatId = await LinkedChatService.getCurrent(
        ctx,
        id
    )

    ctx.vars = {
        commandStrings: ctx.vars.commandStrings,
        chatId,
        id,
        chatMember: new LazyValue(
            async () => {
                return await ContextUtils.getChatMember(
                    ctx,
                    {
                        chatId,
                        id
                    }
                )
            },
            'chatMember'
        ),
        isOwner: new LazyValue(
            async () => {
                return RankUtils.canUseWithoutRank(
                    await ctx.vars.chatMember.get(),
                    id
                )
            },
            'isOwner'
        ),
        shortCommand: undefined,
        roleplay: undefined,
        balance: new LazyValue(
            async () => {
                return chatId ? await BalanceService.create(
                    Balance.default(
                        chatId,
                        id
                    )
                ) : undefined
            },
            'balance'
        ),
        user: new LazyValue(
            async () => {
                return chatId ? await UserService.get(
                    chatId,
                    id
                ) : undefined
            },
            'user'
        ),
        levelObject: new LazyValue(
            async () => {
                return chatId ? await LevelService.get(
                    chatId,
                    id
                ) : undefined
            }
        ),
        level: new LazyValue(
            async () => {
                const level = await ctx.vars.levelObject.get()
                return ExperienceUtils.getLevelFromObject(level)
            }
        ),
        duelist: new LazyValue(
            async () => {
                return chatId ? await DuelistService.get(
                    chatId,
                    id
                ) : undefined
            }
        ),
        chat: new LazyValue(
            async () => {
                return chatId ? await ChatService.get(chatId) : undefined
            }
        ),
        duel: {
            duel: new LazyValue(
                async () => {
                    return chatId ? await DuelService.get(chatId) : undefined
                }
            ),
            currentStep: new LazyValue(
                async () => {
                    return chatId ? await DuelStepService.getCurrent(chatId) : undefined
                }
            ),
            currentDuelist: new LazyValue(
                async () => {
                    const duel = await ctx.vars.duel.duel.get()
                    return await DuelStepService.getCurrentDuelist(duel)
                }
            )
        },
    }

    ctx.actionData = {}

    return next()
}