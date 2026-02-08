import { ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { duelSchema } from '../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import DuelCheckService from '../../db/services/duel/DuelCheckService'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ChosenSkillsService from '../../db/services/chosen-skills/ChosenSkillsService'
import SkillService from '../../db/services/chosen-skills/SkillService'
import SkillUtils from '../../../utils/skills/SkillUtils'

type Data = {
    duel: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = duelSchema
    protected _buttonTitle?: string | undefined = "Дуэль: Навыки"

    constructor () {
        super()
        this._name = 'duelskills'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId,
            id
        } = options

        const {
            duel: duelId
        } = data
        if(await DuelCheckService.showAlertIfCantUse({
            ctx,
            duelId,
            userId: id
        })) return

        const chosenSkills = await SkillService.get(chatId, id)

        await MessageUtils.editTextFromResource(
            ctx,
            'text/commands/skills/choose.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'duels/skills',
                    {
                        globals: {
                            duelId
                        },
                        values: {
                            skill: chosenSkills.map((skillId, index) => {
                                const skill = SkillUtils.getSkillById(skillId)
                                const title = skill.info.title
                                return {
                                    text: title,
                                    data: {
                                        index
                                    }
                                }
                            })
                        }
                    }
                )
            }
        )
    }
}