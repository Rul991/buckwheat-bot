import { number, object, string, ZodType } from 'zod'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import Skill from '../../../interfaces/duel/Skill'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import SkillUtils from '../../../utils/skills/SkillUtils'
import SkillTextUtils from '../../../utils/skills/SkillTextUtils'

type Data = {
    name: string
    id?: number,
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle: string = 'Навык: Просмотр в окне'
    protected _schema: ZodType<Data> = object({
        name: string(),
        id: number().optional(),
    })

    constructor () {
        super()
        this._name = 'skillalert'
    }

    async execute({ ctx, data, chatId }: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id,
            name
        } = data
        if (id && await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const skill = SkillUtils.getSkillById(
            name
        )

        await ContextUtils.showCallbackMessage(
            ctx,
            await SkillTextUtils.alert({
                ctx,
                chatId,
                userId: id ?? ctx.from.id,
                skill
            }),
            true
        )
    }
}