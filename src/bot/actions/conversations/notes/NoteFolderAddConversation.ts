import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { MAX_NOTE_FOLDER_TITLE_LENGTH } from "../../../../consts/lengths"
import NoteFolderService from "../../../../db/services/notes/NoteFolderService"
import NoteFolder from "../../../../db/entities/notes/NoteFolder"
import SettingValueService from "../../../../db/services/settings/SettingValueService"
import { notesPublicSetting } from "../../../../resources/settings/user"

type T = []

class NoteFolderAddConversation extends ConversationAction<T> {
    override name: string = 'note-folder-add'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context): Promise<void> {
        const needId = ctx.from!.id

        await ConversationUtils.replyInConversation(
            conversation,
            'notes-folder/conversation/add/enter',
            {
                vars: {
                    max: MAX_NOTE_FOLDER_TITLE_LENGTH
                },
                lazyKeys: ['user']
            }
        )

        const textCtx = await conversation.waitFor('msg:text')
            .andFrom(needId)
        const text = textCtx.msg.text
            .slice(0, MAX_NOTE_FOLDER_TITLE_LENGTH)
            .trim()

        await conversation.external(
            async _ => {
                const isPublic = await SettingValueService.getValue({
                    id: needId,
                    setting: notesPublicSetting
                })

                await NoteFolderService.create(
                    new NoteFolder({
                        owner: needId,
                        title: text,
                        isPublic
                    })
                )
            }
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'notes-folder/conversation/add/added',
            {
                lazyKeys: ['user'],
                vars: {
                    title: text
                }
            }
        )
    }
}

export default new NoteFolderAddConversation()