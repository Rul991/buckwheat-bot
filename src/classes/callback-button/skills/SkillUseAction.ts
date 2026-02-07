import { object, string, ZodType } from 'zod'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import SkillAttack from '../../../enums/SkillAttack'
import TimeUtils from '../../../utils/TimeUtils'
import { DARTS_TIME } from '../../../utils/values/consts'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { duelSchema } from '../../../utils/values/schemas'
import SkillAttackUtils from '../../../utils/skills/SkillAttackUtils'

type Data = {
    name: string
    duel: number
}

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
            data 
        } = options
        const attack = await this._getAttack(ctx)
    }
}