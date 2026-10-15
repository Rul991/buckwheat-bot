import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import ExportImportManager from "../../../../utils/data/ExportImportManager"
import ExportImportDataService from "../../../../db/services/export-import/ExportImportDataService"

class ImportConversation extends ConversationAction<[number]> {
    override name: string = 'import'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, definitionId: number): Promise<void> {
        const id = ctx.from!.id
        const definition = ExportImportManager.get(definitionId)!

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

        const hashCtx = await conversation
            .waitFor(
                'msg:text',
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

        const hash = hashCtx.msg.text
        const key = definition.key
        const exportImportData = await conversation.external(
            async () => {
                return await ExportImportDataService.get(
                    key,
                    hash
                )
            }
        )

        if (!exportImportData) {
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/wrong-hash',
                async ctx => ({
                    vars: {
                        definition: definition.getVars(ctx),
                    },
                    lazyKeys: ['user']
                })
            )
            return
        }

        const parseResult = definition.schema.safeParse(
            exportImportData.values
        )

        if (!parseResult.success) {
            await conversation.external(
                async () => {
                    return await ExportImportDataService.delete(
                        key,
                        hash
                    )
                }
            )
            await ConversationUtils.replyInConversation(
                conversation,
                'import/conversation/wrong-data',
                async ctx => ({
                    vars: {
                        definition: definition.getVars(ctx),
                    },
                    lazyKeys: ['user']
                })
            )
            return
        }

        const data = exportImportData.values
        const result = await conversation.external(
            async ctx => {
                const chatId = ctx.vars.chatId!
                return await definition.importCallback({
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