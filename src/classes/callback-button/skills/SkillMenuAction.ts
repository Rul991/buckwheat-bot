import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext, CallbackButtonValue } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import DuelUtils from '../../../utils/DuelUtils'
import ChoosedSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import UserClassService from '../../db/services/user/UserClassService'
import FileUtils from '../../../utils/FileUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ContextUtils from '../../../utils/ContextUtils'
import ClassUtils from '../../../utils/ClassUtils'
import SkillUtils from '../../../utils/SkillUtils'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import { UNKNOWN_EFFECT } from '../../../utils/values/consts'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
        required: ['id']
    }

    constructor() {
        super()
        this._name = 'skillmenu'
    }

    async execute(ctx: CallbackButtonContext, {id}: Data): Promise<string | void> {
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return 
        
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        const type = await UserClassService.get(chatId, id)
        const chosenSkills = await ChosenSkillsService.get(chatId, id)

        const skills = {
            current: chosenSkills.skills.length ?? 0,
            max: chosenSkills.maxCount ?? 0
        }

        const userSkills = await ChoosedSkillsService.getSkills(chatId, id)
        const buttons: CallbackButtonValue[] = await Promise.all(
            userSkills.map(async (skill, i) => 
                ({
                    text: (await SkillUtils.getSkillById(type, skill))?.title ?? UNKNOWN_EFFECT,
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
                    inline_keyboard: await InlineKeyboardManager.map(
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