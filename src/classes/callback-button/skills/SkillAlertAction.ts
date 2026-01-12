import { number, object, string, ZodType } from 'zod'
import { ClassTypes } from '../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import SkillUtils from '../../../utils/SkillUtils'
import ContextUtils from '../../../utils/ContextUtils'
import Skill from '../../../interfaces/duel/Skill'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { classTypesSchema } from '../../../utils/values/schemas'

type Data = {
    name: string
    id?: number,
    type: ClassTypes
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = object({
        name: string(),
        id: number().optional(),
        type: classTypesSchema
    })

    constructor () {
        super()
        this._name = 'salert'
    }

    protected async _getSkill(
        ctx: CallbackButtonContext, 
        data: Data
    ): Promise<Skill | null> {
        const {
            name,
            type: classType
        } = data
        
        const skill = await SkillUtils.getSkillById(
            classType, 
            name
        )
        return skill ?? null
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id
        } = data
        if(id && await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const skill = await this._getSkill(ctx, data)
        if (!skill) return await FileUtils.readPugFromResource('text/actions/skill/hasnt.pug')

        await ContextUtils.showCallbackMessage(
            ctx,
            await SkillUtils.getViewParamsText(ctx, skill),
            true
        )
    }
}