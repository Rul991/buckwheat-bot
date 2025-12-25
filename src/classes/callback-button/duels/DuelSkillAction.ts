import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelService from '../../db/services/duel/DuelService'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'
import ClassUtils from '../../../utils/ClassUtils'
import UserClassService from '../../db/services/user/UserClassService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ContextUtils from '../../../utils/ContextUtils'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import SkillUtils from '../../../utils/SkillUtils'
import { UNKNOWN_EFFECT } from '../../../utils/values/consts'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Data = {
    duel: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            duel: { type: 'number' }
        },
        required: ['duel'],
    }

    constructor () {
        super()
        this._name = 'duelskills'
    }

    async execute({ ctx, data: { duel: id }, chatId }: CallbackButtonOptions<Data>): Promise<string | void> {
        const userId = ctx.from.id

        const duel = await DuelService.get(id)
        if (!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, duel.step.duelist)) return

        const skills = await ChosenSkillsService.getSkills(chatId, userId)
        const className = await UserClassService.get(chatId, userId)

        const buttonsPromise = skills.map(async (v, i) =>
        ({
            text: (await SkillUtils.getSkillById(className, v))?.title ?? UNKNOWN_EFFECT,
            data: JSON.stringify({ index: i })
        }))

        const keyboard = await InlineKeyboardManager.map('duels/skills', {
            globals: {
                duel: JSON.stringify({ id })
            },
            values: {
                skill: await Promise.all(buttonsPromise)
            }
        })

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/skills/choose.pug',
                {
                    changeValues: {
                        emoji: ClassUtils.getEmoji(className)
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            }
        )
    }

}