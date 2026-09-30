import type { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../types/bot"
import { MAX_ROLEPLAY_NAME_LENGTH, MAX_ROLEPLAY_TEXT_LENGTH } from "../../consts/lengths"
import ConversationUtils from "../conversation/ConversationUtils"
import type Roleplay from "../../db/entities/rp/Roleplay"
import { showRoleplayKeyboard } from "../../bot/keyboards/rp"
import type { BuckwheatCommandExecuteResult } from "../../types/results"

type GetTextOptions = {
    conversation: Conversation<BotContext, Context>
    command: string
    needId: number
}

type ShowMessageOptions = {
    roleplay: Roleplay
    id: number
    page: number
    ctx: BotContext
}

export default class RoleplayUtils {
    static async getText({
        conversation,
        command,
        needId
    }: GetTextOptions): Promise<string> {
        return await ConversationUtils.getFormattedText({
            conversation,
            needId,
            max: MAX_ROLEPLAY_TEXT_LENGTH,
            key: 'rp/add/text',
            vars: {
                command
            },
            lazyKeys: ['user']
        })
    }

    static async getName(conversation: Conversation<BotContext, Context>, needId: number): Promise<string> {
        await ConversationUtils.replyInConversation(
            conversation,
            'rp/add/name',
            {
                vars: {
                    max: MAX_ROLEPLAY_NAME_LENGTH,
                },
                lazyKeys: ['user']
            }
        )

        const ctx = await conversation
            .waitFrom(needId)
            .andFor('msg:text')

        const rawText = ctx.msg.text
        const text = rawText.split(' ')[0]!
        return text
    }


    static async showMessage({
        roleplay,
        id,
        page,
        ctx,
    }: ShowMessageOptions): Promise<NonNullable<BuckwheatCommandExecuteResult>> {
        return {
            key: 'rp/show',
            options: {
                vars: {
                    roleplay
                },
                keyboard: await showRoleplayKeyboard(
                    ctx,
                    {
                        id,
                        page,
                        roleplay
                    }
                )
            }
        }
    }
}