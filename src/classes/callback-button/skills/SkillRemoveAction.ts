import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import { type } from 'os'
import ClassUtils from '../../../utils/ClassUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import UserClassService from '../../db/services/user/UserClassService'

type Data = {
    index: number
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            index: { type: 'number' },
            id: { type: 'number' }
        },
        required: ['id', 'index']
    }

    constructor() {
        super()
        this._name = 'skillremove'
    }

    async execute(ctx: CallbackButtonContext, {id, index}: Data): Promise<string | void> {
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

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
                        JSON.stringify({id})
                    )
                }
            }
        )

        return await FileUtils.readPugFromResource(
            `text/actions/skill/delete/${isRemoved ? 'can' : 'cant'}.pug`
        )
    }
}