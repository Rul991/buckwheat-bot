import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext, ClassTypes, Link } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelUtils from '../../../utils/DuelUtils'
import DuelService from '../../db/services/duel/DuelService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import EffectService from '../../db/services/duel/EffectService'
import ContextUtils from '../../../utils/ContextUtils'
import Effect from '../../../interfaces/schemas/duels/Effect'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import UserClassService from '../../db/services/user/UserClassService'
import SkillUtils from '../../../utils/SkillUtils'
import FileUtils from '../../../utils/FileUtils'
import { UNKNOWN_EFFECT } from '../../../utils/values/consts'

type Data = {
    duel: number
}

type SimpleEffect = {
    name: string,
    steps: number
}

type SortedEffects = {
    effects: SimpleEffect[]
    link: Link
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            duel: { type: 'number' }
        },
        required: ['duel']
    }

    constructor() {
        super()
        this._name = 'dueleffects'
    }

    private async _getSortedEffects(chatId: number, effects: Effect[]) {
        const sortedEffects: SortedEffects[] = []
        const classNames: Record<number, ClassTypes> = {}

        for (const {name: effectId, target, remainingSteps} of effects) {
            const foundEffect = sortedEffects.find(v => (
                v.link.link == ContextUtils.getLinkUrl(target)
            ))

            let className = classNames[target]

            if(!className) {
                className = await UserClassService.get(chatId, target)
                classNames[target] = className
            }

            const skill = await SkillUtils.getSkillById(className, effectId)
            const isHide = SkillUtils.isHideName(skill)
            const effectName = isHide ? '?' : skill?.title ?? UNKNOWN_EFFECT

            const newEffect = {
                name: effectName, 
                steps: remainingSteps
            }

            if(foundEffect) {
                foundEffect.effects.push(newEffect)
            }
            else {
                sortedEffects.push({
                    effects: [newEffect],
                    link: await ContextUtils.getUser(chatId, target)
                })
            }
        }

        return sortedEffects
    }

    async execute(ctx: CallbackButtonContext, {duel: duelId}: Data): Promise<string | void> {
        if(await DuelUtils.showAlertIfCantUse(ctx, duelId)) return

        const duel = await DuelService.get(duelId)
        if(!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')
        const { chatId } = duel

        const effects = await EffectService.get(duelId)
        const sortedEffects = await this._getSortedEffects(chatId, effects)

        const text = await FileUtils.readPugFromResource(
            'text/commands/duel/fight/effects.pug',
            {
                changeValues: {
                    effects: sortedEffects,
                }
            }
        )

        await MessageUtils.editText(
            ctx,
            text,
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'duels/back',
                        JSON.stringify({id: duelId})
                    )
                }
            }
        )
    }
}