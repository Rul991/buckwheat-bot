import { ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { duelSchema } from '../../../utils/values/schemas'
import DuelCheckService from '../../db/services/duel/DuelCheckService'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import EffectService from '../../db/services/duel/EffectService'
import { Link } from '../../../utils/values/types/types'
import SkillUtils from '../../../utils/skills/SkillUtils'
import ContextUtils from '../../../utils/ContextUtils'

type Data = {
    duel: number
}

type TextEffect = {
    title: string
    steps: number
}

type TextEffects = {
    link: Link
    effects: TextEffect[]
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = duelSchema
    protected _buttonTitle?: string | undefined = "Дуэль: Эффекты"

    constructor () {
        super()
        this._name = 'dueleffects'
    }

    private async _getTextEffects(chatId: number, duelId: number) {
        const effects = await EffectService.get(duelId)
        const effectMap = new Map<number, TextEffects['effects']>()
        const result: TextEffects[] = []

        for (const effect of effects) {
            const {
                name,
                remainingSteps: steps,
                target
            } = effect

            if (!effectMap.get(target)) {
                effectMap.set(target, [])
            }

            const skill = SkillUtils.getSkillById(name)
            const title = skill.info.title

            const textEffects = effectMap.get(target)!
            textEffects.push({
                title,
                steps
            })
        }

        for (const [id, effects] of effectMap.entries()) {
            result.push({
                effects,
                link: await ContextUtils.getUser(chatId, id)
            })
        }

        return result
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            chatId,
            data,
            ctx,
            id,
        } = options

        const {
            duel: duelId
        } = data

        if (await DuelCheckService.showAlertIfCantUse({
            ctx,
            duelId,
            userId: id
        })) return

        await MessageUtils.editTextFromResource(
            ctx,
            'text/commands/duel/fight/effects.pug',
            {
                changeValues: {
                    effects: await this._getTextEffects(chatId, duelId)
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'duels/continue',
                    {
                        globals: {
                            duelId,
                            text: 'Назад'
                        }
                    }
                ),
            }
        )
    }
}