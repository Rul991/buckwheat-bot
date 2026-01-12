import { object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import UserClassService from '../../db/services/user/UserClassService'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import FileUtils from '../../../utils/FileUtils'
import ClassUtils from '../../../utils/ClassUtils'
import SkillUtils from '../../../utils/SkillUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'

type Data = {
    skillId: string,
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            skillId: string()
        }))

    constructor() {
        super()
        this._name = 'skilladd'
    }

    async execute({ctx, data: {id, skillId}, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return 

        const type = await UserClassService.get(chatId, id)
        const skill = await SkillUtils.getSkillById(type, skillId)
        if(!skill) return await FileUtils.readPugFromResource('text/actions/skill/hasnt.pug')

        const isAdded = await ChosenSkillsService.addSkill(chatId, id, skillId)
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
                        JSON.stringify({id})
                    )
                }
            }
        )

        const {
            title
        } = skill

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