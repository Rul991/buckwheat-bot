import { ZodType } from 'zod'
import { CallbackButtonValue } from '../../../utils/values/types/types'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import UserClassService from '../../db/services/user/UserClassService'
import FileUtils from '../../../utils/FileUtils'
import ContextUtils from '../../../utils/ContextUtils'
import ClassUtils from '../../../utils/ClassUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'
import ChosenSkillsService from '../../db/services/chosen-skills/ChosenSkillsService'
import SkillUtils from '../../../utils/skills/SkillUtils'
import SkillService from '../../db/services/chosen-skills/SkillService'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
    protected _buttonTitle: string = 'Навык: Меню'

    constructor() {
        super()
        this._name = 'skillmenu'
    }

    async execute({ctx, data: {id}, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return 
        
        const type = await UserClassService.get(chatId, id)
        const chosenSkills = await ChosenSkillsService.get(chatId, id)

        const skills = {
            current: chosenSkills.skills.length ?? 0,
            max: chosenSkills.maxCount ?? 0
        }

        const userSkills = await SkillService.get(chatId, id)
        const buttons: CallbackButtonValue[] = await Promise.all(
            userSkills.map(async (skill, i) => 
                ({
                    text: SkillUtils.getSkillById(skill).info.title,
                    data: JSON.stringify({index: i})
                })
            )
        )

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/skills/menu.pug',
                {
                    changeValues: {
                        emoji: ClassUtils.getEmoji(type),
                        skills
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.map(
                        'skills/menu', 
                        {
                            globals: {
                                id: JSON.stringify({id})
                            },
                            values: {
                                skill: buttons
                            }
                        }
                    )
                }
            }
        )
    }

}