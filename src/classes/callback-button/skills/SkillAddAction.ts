import { object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import UserClassService from '../../db/services/user/UserClassService'
import MessageUtils from '../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import FileUtils from '../../../utils/FileUtils'
import ClassUtils from '../../../utils/ClassUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'
import SkillUtils from '../../../utils/skills/SkillUtils'
import SkillService from '../../db/services/chosen-skills/SkillService'

type Data = {
    skill: string,
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle: string = 'Навык: Добавить'
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            skill: string()
        }))

    constructor () {
        super()
        this._name = 'skilladd'
    }

    async execute({ ctx, data: { id, skill: skillId }, chatId }: CallbackButtonOptions<Data>): Promise<string | void> {
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const type = await UserClassService.get(chatId, id)
        const skill = SkillUtils.getSkillById(skillId)
        if (!skill) return await FileUtils.readPugFromResource('text/actions/skill/hasnt.pug')

        const isAdded = await SkillService.add(chatId, id, skillId)
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
                    inline_keyboard: await LegacyInlineKeyboardManager.get(
                        'skills/menu',
                        JSON.stringify({ id })
                    )
                }
            }
        )

        const {
            title
        } = skill.info

        return await FileUtils.readPugFromResource(
            `text/actions/skill/add/${isAdded ? 'can' : 'cant'}.pug`,
            {
                changeValues: {
                    title
                }
            }
        )
    }
}