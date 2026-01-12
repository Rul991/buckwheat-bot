import { number, object, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import ClassUtils from '../../../utils/ClassUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import UserClassService from '../../db/services/user/UserClassService'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'

type Data = {
    index: number
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            index: number()
        }))

    constructor () {
        super()
        this._name = 'skillremove'
    }

    async execute({ ctx, data: { id, index }, chatId }: CallbackButtonOptions<Data>): Promise<string | void> {
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const isRemoved = await ChosenSkillsService.removeSkill(chatId, id, index)
        const type = await UserClassService.get(chatId, id)

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/skills/menu.pug',
                {
                    changeValues: {
                        emoji: ClassUtils.getEmoji(type)
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'skills/menu',
                        JSON.stringify({ id })
                    )
                }
            }
        )

        return await FileUtils.readPugFromResource(
            `text/actions/skill/delete/${isRemoved ? 'can' : 'cant'}.pug`
        )
    }
}