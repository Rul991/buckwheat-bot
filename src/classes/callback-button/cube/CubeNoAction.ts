import { JSONSchemaType } from 'ajv'
import CubeData from '../../../interfaces/callback-button-data/CubeData'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import CallbackButtonAction from '../CallbackButtonAction'
import { cubeDataSchema } from '../../../utils/values/schemas'
import FileUtils from '../../../utils/FileUtils'

export default class CubeNoAction extends CallbackButtonAction<CubeData> {
    protected _schema: JSONSchemaType<CubeData> = cubeDataSchema
    constructor() {
        super()
        this._name = 'cubeno'
    }

    async execute(ctx: CallbackButtonContext, data: CubeData): Promise<string | void> {
        const {r: replyId, u: userId} = data
        
        const chatId = await LinkedChatService.getCurrent(ctx, replyId)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')
        const changeValues = await ContextUtils.getUserFromContext(ctx)

        const doCallback = async (filename: string) => {
            await MessageUtils.editMarkup(ctx)
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/cubes/${filename}.pug`,
                {
                    changeValues,
                }
            )
        }
        
        if(ctx.from.id == replyId) {
            await doCallback('cancel')
        }
        else if(ctx.from.id == userId) {
            await doCallback('creator-cancel')
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}