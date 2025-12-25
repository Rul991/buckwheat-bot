import { JSONSchemaType } from 'ajv'
import { UseSkillOptions } from '../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelUtils from '../../../utils/DuelUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../db/services/user/UserClassService'
import SkillUtils from '../../../utils/SkillUtils'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import DuelService from '../../db/services/duel/DuelService'
import MessageUtils from '../../../utils/MessageUtils'
import SkillAttack from '../../../enums/SkillAttack'
import ContextUtils from '../../../utils/ContextUtils'
import TimeUtils from '../../../utils/TimeUtils'
import { DARTS_TIME } from '../../../utils/values/consts'
import DuelistService from '../../db/services/duelist/DuelistService'
import EffectService from '../../db/services/duel/EffectService'
import FileUtils from '../../../utils/FileUtils'
import LastStepService from '../../db/services/duel/LastStepService'
import Skill from '../../../interfaces/duel/Skill'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Data = {
    name: string
    duel: number
}

type CantUseSkillOptions = {
    chatId: number
    id: number
    skill: Skill
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            duel: { type: 'number' }
        },
        required: ['name', 'duel']
    }

    constructor () {
        super()
        this._name = 'skilluse'
    }

    private async _getStartData(
        ctx: CallbackButtonContext,
        {
            name: skillId,
            duel: duelId
        }: Data
    ) {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        const className = await UserClassService.get(chatId, id)
        const skill = await SkillUtils.getSkillById(className, skillId)
        if (!skill) return await FileUtils.readPugFromResource('text/actions/skill/hasnt.pug')

        const cantUseSkill = await this._cantUseSkill({ chatId, id, skill })
        if (cantUseSkill) return cantUseSkill

        const duel = await DuelService.get(duelId)
        if (!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')

        return {
            id,
            chatId,
            skill,
            duel
        }
    }

    private async _cantUseSkill({
        chatId,
        id,
        skill
    }: CantUseSkillOptions) {
        const skills = await ChosenSkillsService.getSkills(chatId, id)

        if (!skill.isAlwaysUsable && skills.every(v => v != skill.id)) {
            return await FileUtils.readPugFromResource(
                'text/actions/skill/use/cant.pug'
            )
        }

        return null
    }

    private async _getAttack(ctx: CallbackButtonContext) {
        const dice = await MessageUtils.answerDice(
            ctx,
            '🎯'
        )

        if (!dice) return

        await MessageUtils.editMarkup(ctx, undefined)
        await TimeUtils.sleep(DARTS_TIME)

        const { value } = dice.dice
        return value == 6 ? SkillAttack.Crit : value == 1 ? SkillAttack.Fail : SkillAttack.Normal
    }

    private async _useSkill(useSkillOptions: Omit<UseSkillOptions, 'attack'>) {
        const {
            ctx
        } = useSkillOptions

        const attack = await this._getAttack(ctx)
        if (!attack) return null

        const { isUsed } = await SkillUtils.useSkill({ ...useSkillOptions, attack })

        if (!isUsed) {
            await ContextUtils.showAlertFromFile(
                ctx,
                'text/actions/skill/use/cant.pug'
            )
            return null
        }
        return attack
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            name: skillId,
            duel: duelId
        } = data

        if (await DuelUtils.showAlertIfCantUse(ctx, duelId)) return
        const startData = await this._getStartData(ctx, data)

        if (typeof startData == 'string') {
            return startData
        }

        const {
            id,
            chatId,
            skill,
            duel
        } = startData

        await DuelService.changeDuelist(duelId)

        const useSkillOptions = {
            skill,
            ctx,
            userId: id,
            enemyId: DuelUtils.getEnemy(duel, ctx.from.id)
        }

        const oldEffects = await EffectService.get(duelId)
        const attack = await this._useSkill(useSkillOptions)
        if (!attack) return
        await EffectService.use(
            ctx,
            duel,
            oldEffects
        )

        await LastStepService.set(
            duelId,
            {
                duelist: DuelUtils.getEnemy(duel, id),
                skill: skillId
            }
        )

        const effectMessage = [
            await FileUtils.readPugFromResource(
                'text/commands/duel/fight/skill-use.pug',
                {
                    changeValues: {
                        attack,
                        skillName: skill.title,
                    }
                }
            ),
            await SkillUtils.getViewParamsText(
                ctx,
                skill,
                true,
                attack
            )
        ].join('\n')

        await MessageUtils.answer(
            ctx,
            effectMessage
        )

        const ids = [duel.firstDuelist, duel.secondDuelist]

        for (const id of ids) {
            const { hp } = await DuelistService.getCurrentCharacteristics(chatId, id)

            if (hp <= 0) {
                await DuelUtils.end(
                    ctx,
                    {
                        chatId,
                        duelId,
                        winnerId: DuelUtils.getEnemy(duel, id)
                    }
                )
                return
            }
        }

        const { text, keyboard } = await DuelUtils.getParamsForFightMessage(
            chatId,
            await DuelService.get(duelId) ?? duel
        )

        await MessageUtils.answer(
            ctx,
            text,
            {
                inlineKeyboard: keyboard
            }
        )
        await MessageUtils.deleteMessage(ctx)
    }
}