import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext, ClassTypes } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'
import SkillUtils from '../../../utils/SkillUtils'
import ContextUtils from '../../../utils/ContextUtils'
import Skill from '../../../interfaces/duel/Skill'
import FileUtils from '../../../utils/FileUtils'

type Data = {
    name: string
    id?: number,
    type: ClassTypes
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            id: { type: 'number', nullable: true },
            type: { type: 'string' },
        },
        required: ['name']
    }

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

    async execute(ctx: CallbackButtonContext, data: Data): Promise<string | void> {
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