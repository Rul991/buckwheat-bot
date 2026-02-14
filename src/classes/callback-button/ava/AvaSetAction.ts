import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import { idSchema } from '../../../utils/values/schemas'
import ContextUtils from '../../../utils/ContextUtils'
import AvaHistoryService from '../../db/services/user/AvaHistoryService'
import FileUtils from '../../../utils/FileUtils'
import UserImageService from '../../db/services/user/UserImageService'

type Data = {
    id: number
    index: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(
            object({
                index: number()
            })
        )

    constructor() {
        super()
        this._name = 'avaset'
        this._buttonTitle = 'Аватарка: Поставить'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            chatId,
            data,
            ctx
        } = options

        const {
            id,
            index
        } = data

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const history = await AvaHistoryService.get(chatId, id)
        const ava = history[index]
        if(!ava) return await FileUtils.readPugFromResource('text/commands/profile/ava/undefined.pug')

        const {
            imageId
        } = ava

        await UserImageService.update(
            chatId,
            id,
            imageId,
            false
        )

        return await FileUtils.readPugFromResource(
            'text/commands/profile/ava/changed.pug',
            {
                changeValues: {
                    index
                }
            }
        )
    }
}