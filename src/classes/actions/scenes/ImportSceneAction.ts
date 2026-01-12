import { Update } from 'telegraf/types'
import ContextUtils from '../../../utils/ContextUtils'
import ExportImportManager from '../../../utils/ExportImportManager'
import MessageUtils from '../../../utils/MessageUtils'
import { UNKWOWN_IMPORT_TITLE } from '../../../utils/values/consts'
import { SceneOptions } from '../../../utils/values/types/action-options'
import { SceneContextData } from '../../../utils/values/types/contexts'
import { IdContextData } from '../../../utils/values/types/types'
import SceneAction from './SceneAction'
import { Context } from 'telegraf'
import FetchUtils from '../../../utils/FetchUtils'

type Data = {
    id: number
    chatId: number
    name: string
}

export default class extends SceneAction<Data> {
    constructor() {
        super()
        this._name = 'import'
    }

    protected async _execute(options: SceneOptions<Data>): Promise<void> {
        const {
            scene
        } = options

        const importAndSendMessage = async (
            ctx: Context<Update> & SceneContextData<Data> & IdContextData,
            data: string
        ) => {
            const options = ctx.scene.state

            const {
                chatId,
                id
            } = options

            const {
                imported,
                value
            } = await ExportImportManager.import({
                ...options,
                data
            })

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/import/${imported ? 'imported' : 'not-imported'}.pug`,
                {
                    changeValues: {
                        title: ExportImportManager.getTitleByData(value),
                        user: await ContextUtils.getUser(chatId, id),
                        rank: ExportImportManager.needRank
                    },
                    isReply: false
                }
            )
            
            await ctx.scene.leave()
        }

        scene.enter(async ctx => {
            const {
                name
            } = ctx.scene.state

            const value = ExportImportManager.getById(name)

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/import/start.pug',
                {
                    changeValues: {
                        title: ExportImportManager.getTitleByData(value),
                        description: value?.description
                    }
                }
            )
        })

        scene.on('text', async ctx => {
            const data = ctx.text
            await importAndSendMessage(
                ctx,
                data
            )
        })

        scene.on('document', async ctx => {
            const document = ctx.message.document
            const fileId = document.file_id
            const url = await ctx.telegram.getFileLink(fileId)
            const data = await FetchUtils.text(url)

            await importAndSendMessage(
                ctx,
                data
            )
        })
    }
}