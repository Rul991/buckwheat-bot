import { JSONSchemaType } from 'ajv'
import CubeData from '../../../interfaces/callback-button-data/CubeData'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import CallbackButtonAction from '../CallbackButtonAction'
import { cubeDataSchema } from '../../../utils/values/schemas'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export default class CubeNoAction extends CallbackButtonAction<CubeData> {
    protected _schema: JSONSchemaType<CubeData> = cubeDataSchema
    constructor () {
        super()
        this._name = 'cubeno'
    }

    async execute({ ctx, data }: CallbackButtonOptions<CubeData>): Promise<string | void> {
        const { r: replyId, u: userId } = data

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

        if (ctx.from.id == replyId) {
            await doCallback('cancel')
        }
        else if (ctx.from.id == userId) {
            await doCallback('creator-cancel')
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}