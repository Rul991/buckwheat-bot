import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { MAX_NOTE_TEXT_LENGTH } from "../../../../consts/lengths"
import NoteService from "../../../../db/services/notes/NoteService"
import Note from "../../../../db/entities/notes/Note"

type T = [{
    folderId: number
}]

class NoteAddConversation extends ConversationAction<T> {
    override name: string = 'note-add'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, ...[values]: T): Promise<void> {
        const needId = ctx.from!.id
        const {
            folderId
        } = values

        const text = await ConversationUtils.getFormattedText({
            conversation,
            needId,
            lazyKeys: ['user'],
            key: 'notes/conversation/enter',
            max: MAX_NOTE_TEXT_LENGTH
        })

        await conversation.external(
            async _ => {
                await NoteService.create(
                    new Note({
                        text,
                        folderId
                    })
                )
            }
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'notes/conversation/added',
            {
                lazyKeys: ['user']
            }
        )
    }
}

export default new NoteAddConversation()