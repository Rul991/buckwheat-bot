import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { MAX_SHORT_COMMAND_LENGTH, MAX_SHORT_COMMAND_TEXT_LENGTH } from "../../../../consts/lengths"
import ShortCommandService from "../../../../db/services/short/ShortCommandService"
import ShortCommand from "../../../../db/entities/short/ShortCommand"
import StringUtils from "../../../../utils/string/StringUtils"

type T = []

class ShortCommandAddConversation extends ConversationAction<T> {
    override name: string = 'short-command-add'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, ...[]: T): Promise<void> {
        const needId = ctx.from!.id
        const wrongName = await conversation.external(
            async ctx => ctx.t('shorten/conversation/name')
        )

        const rawCommand = await ConversationUtils.getText({
            conversation,
            needId,
            max: MAX_SHORT_COMMAND_LENGTH,
            lazyKeys: ['user'],
            key: 'shorten/conversation/enter/command'
        })
        const command = StringUtils.splitBySpace(rawCommand, 1)[0]!

        if (command == wrongName) {
            await ConversationUtils.replyInConversation(
                conversation,
                'shorten/conversation/wrong-name',
                {
                    lazyKeys: ['user'],
                    vars: {
                        name: wrongName
                    }
                }
            )
            return
        }

        const text = await ConversationUtils.getText({
            conversation,
            needId,
            max: MAX_SHORT_COMMAND_TEXT_LENGTH,
            lazyKeys: ['user'],
            key: 'shorten/conversation/enter/text'
        })

        const shortCommand = await conversation.external(
            async _ => {
                return await ShortCommandService.create(
                    new ShortCommand({
                        id: needId,
                        command,
                        text
                    })
                )
            }
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'shorten/conversation/new',
            {
                lazyKeys: ['user'],
                vars: {
                    shortCommand
                }
            }
        )
    }
}

export default new ShortCommandAddConversation()