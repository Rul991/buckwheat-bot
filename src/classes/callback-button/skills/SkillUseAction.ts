import { object, string, ZodType } from 'zod'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import SkillAttack from '../../../enums/SkillAttack'
import TimeUtils from '../../../utils/TimeUtils'
import { DARTS_TIME, HP_MIN_VALUE } from '../../../utils/values/consts'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { duelSchema } from '../../../utils/values/schemas'
import SkillAttackUtils from '../../../utils/skills/SkillAttackUtils'
import EffectService from '../../db/services/duel/EffectService'
import DuelCheckService from '../../db/services/duel/DuelCheckService'
import DuelService from '../../db/services/duel/DuelService'
import DuelStepService from '../../db/services/duel/DuelStepService'
import DuelUtils from '../../../utils/duel/DuelUtils'
import SkillUtils from '../../../utils/skills/SkillUtils'
import { DuelEndUtilsOptions } from '../../../utils/values/types/duels'
import DuelistService from '../../db/services/duelist/DuelistService'
import { ExecuteSkillOptions } from '../../../utils/values/types/skills'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ContextUtils from '../../../utils/ContextUtils'

type Data = {
    name: string
    duel: number
}

type CheckWinnerOptions = Omit<DuelEndUtilsOptions, 'winner'>

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Дуэль: Использование навыка"
    protected _schema: ZodType<Data> = duelSchema
        .and(object({
            name: string(),
        }))

    constructor () {
        super()
        this._name = 'skilluse'
    }

    private async _checkWinner(options: CheckWinnerOptions) {
        const {
            chatId,
            duel
        } = options
        const ids = [duel.firstDuelist, duel.secondDuelist]

        for (const id of ids) {
            const { hp } = await DuelistService.getCurrentCharacteristics(chatId, id)
            if (hp <= HP_MIN_VALUE) {
                await DuelUtils.end({
                    ...options,
                    winner: DuelUtils.getEnemy(duel, id)
                })
                return true
            }
        }

        return false
    }

    private async _getAttack(ctx: CallbackButtonContext) {
        const dice = await MessageUtils.answerDice(
            ctx,
            '🎯'
        )
        if (!dice) return SkillAttack.Normal

        await MessageUtils.editMarkup(ctx, undefined)
        await TimeUtils.sleep(DARTS_TIME)

        const { value } = dice.dice
        return SkillAttackUtils.getByDice(value)
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data,
            id: userId,
            chatId
        } = options

        const {
            name: skillId,
            duel: duelId
        } = data

        const duel = await DuelService.get(duelId)
        if (!duel) return 'no-duel'
        if (await DuelCheckService.showAlertIfCantUse({
            ctx,
            duelId,
            userId
        })) return

        const skill = SkillUtils.getSkillById(skillId)
        const enemyId = DuelUtils.getEnemy(duel, userId)
        const skillUseOptions: ExecuteSkillOptions = {
            ctx,
            chatId,
            duel,
            userId,
            enemyId,
            skill,
            attack: SkillAttack.Normal
        }

        const isPreChecked = await SkillUtils.precheckSkill(skillUseOptions)
        if (!isPreChecked) {
            return 'not-prechecked'
        }

        // const oldEffects = await EffectService.get(duelId)
        await EffectService.use(
            ctx,
            duel,
            // oldEffects
        )

        const attack = await this._getAttack(ctx)
        await SkillUtils.executeSkill({
            ...skillUseOptions,
            attack
        })

        const newEffects = await EffectService.get(duelId)
        const newStep = await DuelStepService.fromDuelists(
            duel,
            {
                effects: newEffects,
                skill: skillId,
                startTime: Date.now()
            }
        )

        await DuelStepService.add(
            duelId,
            newStep
        )

        if (await this._checkWinner({
            chatId,
            ctx,
            duel
        })) return

        const effectsText = await SkillUtils.getTextsSkill({
            ...skillUseOptions,
            skill,
            attack
        })

        const nextStep = await DuelStepService.getCurrent(duelId)
        const nextStepDuelist = nextStep?.duelist

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/fight/skill-use.pug',
            {
                changeValues: {
                    skillTitle: skill.info.title,
                    attack,
                    effectsText,
                    user: await ContextUtils.getUser(chatId, nextStepDuelist)
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'duels/continue',
                    {
                        globals: {
                            duelId,
                            text: 'Продолжить дуэль'
                        }
                    }
                )
            }
        )

        await MessageUtils.deleteMessage(ctx)
    }
}