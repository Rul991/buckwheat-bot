import { number, object, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import AwardsService from '../../db/services/awards/AwardsService'
import FileUtils from '../../../utils/FileUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'

type Data = {
    id?: number
    owner: number
    index: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = object({
        index: number(),
        owner: number(),
        id: number().optional()
    })

    constructor () {
        super()
        this._name = 'awardremove'
        this._buttonTitle = 'Награда: Удалить'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            chatId,
            data,
        } = options

        const {
            index,
            owner,
            id
        } = data

        const {
            awards = []
        } = await AwardsService.get(
            chatId,
            owner
        )

        const award = awards[index]
        if (!award) return await FileUtils.readPugFromResource(
            'text/commands/award/remove/no-award.pug'
        )

        const {
            givenBy = owner
        } = award
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, givenBy)) return

        await AwardsService.remove(
            chatId,
            owner,
            index
        )

        await MessageUtils.editMarkup(
            ctx,
            {
                inline_keyboard: await InlineKeyboardManager.get(
                    'awards/back',
                    {
                        globals: {
                            id,
                            index,
                            owner
                        }
                    }
                )
            }
        )
    }
}