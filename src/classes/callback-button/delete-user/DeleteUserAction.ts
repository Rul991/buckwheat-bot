import { ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import { idSchema } from '../../../utils/values/schemas'
import RankUtils from '../../../utils/RankUtils'
import TotalService from '../../db/services/total/TotalService'
import UserNameService from '../../db/services/user/UserNameService'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema

    constructor() {
        super()
        this._name = 'deleteuser'
        this._buttonTitle = 'Забыть игрока'
        this._minimumRank = RankUtils.max
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            chatId,
            ctx
        } = options

        const {
            id
        } = data

        const name = await UserNameService.get(
            chatId,
            id
        )

        await TotalService.deleteUser(
            chatId,
            id
        )


        await MessageUtils.deleteMessage(ctx)
        return await FileUtils.readPugFromResource(
            'text/commands/delete-user/done.pug',
            {
                changeValues: {
                    name
                }
            }
        )
    }
}