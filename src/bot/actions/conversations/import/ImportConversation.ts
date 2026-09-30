import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import ExportImportManager from "../../../../utils/data/ExportImportManager"
import FileUtils from "../../../../utils/bot/FileUtils"
import JsonUtils from "../../../../utils/string/JsonUtils"
import { treeifyError } from "zod"

class ImportConversation extends ConversationAction<[number]> {
    private readonly _minFileSize = 2
    private readonly _maxFileSize = 20 * 1024 * 1024
    override name: string = 'import'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, definitionId: number): Promise<void> {
        const id = ctx.from!.id
        const definition = ExportImportManager.get(definitionId)!
        const checkpoint = conversation.checkpoint()

        await ConversationUtils.replyInConversation(
            conversation,
            'import/conversation/enter',
            async ctx => ({
                vars: {
                    definition: definition.getVars(ctx),
                },
                lazyKeys: ['user']
            })
        )

        const documentCtx = await conversation
            .waitFor(
                'msg:document',
                {
                    otherwise: async _ => {
                        await ConversationUtils.replyInConversation(
                            conversation,
                            'import/conversation/abort',
                            {
                                lazyKeys: ['user']
                            }
                        )
                        await conversation.halt()
                    }
                }
            )
            .andFrom(id)

        const isJson = documentCtx.msg.document.mime_type == 'application/json'
        if (!isJson) {
            return await conversation.rewind(checkpoint)
        }

        const fileSize = documentCtx.msg.document.file_size ?? 0
        if (fileSize < this._minFileSize || fileSize > this._maxFileSize) {
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/wrong-size',
                {
                    lazyKeys: ['user'],
                    vars: {
                        size: {
                            current: fileSize,
                            min: this._minFileSize
                        }
                    }
                }
            )
            return
        }

        const file = await documentCtx.getFile()
        const filePath = file.file_path
        const text = await FileUtils.downloadAsText(filePath)

        if (!text) {
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/no-text',
                {
                    lazyKeys: ['user']
                }
            )
            return
        }

        const json = JsonUtils.parse(text)
        if (json === undefined) {
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/wrong-data',
                {
                    lazyKeys: ['user']
                }
            )
            return
        }
        const schema = definition.schema
        const parseResult = schema.safeParse(json)

        if (parseResult.success === false) {
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/wrong-data',
                {
                    lazyKeys: ['user'],
                    vars: {
                        error: treeifyError(parseResult.error)
                    }
                }
            )
            return
        }

        const data = parseResult.data
        let result = false
        await conversation.external(
            async ctx => {
                const chatId = ctx.vars.chatId!
                result = await definition.importCallback({
                    chatId,
                    id,
                    data,
                    ctx
                })
            }
        )

        if (result) {
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/imported',
                async ctx => {
                    return {
                        lazyKeys: ['user'],
                        vars: {
                            definition: definition.getVars(ctx),
                            chat: await ctx.vars.chat.require()
                        }
                    }
                }
            )
        }
        else {
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/not-imported',
                async ctx => {
                    return {
                        lazyKeys: ['user'],
                        vars: {
                            definition: definition.getVars(ctx),
                        }
                    }
                }
            )
        }
    }
}

export default new ImportConversation()