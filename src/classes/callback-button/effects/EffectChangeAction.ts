import SkillUtils from '../../../utils/skills/SkillUtils'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, CallbackButtonValue, TinyCurrentIncreaseId } from '../../../utils/values/types/types'
import UserClassService from '../../db/services/user/UserClassService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

type Data = CallbackButtonValue
type ButtonScrollerData = TinyCurrentIncreaseId

export default class extends ButtonScrollerAction<Data, ButtonScrollerData> {
    protected _buttonTitle: string = 'Эффекты: Пролистывание'
    protected _filename: string = 'effects/classes'

    constructor () {
        super()
        this._name = 'echg'
    }

    protected async _getObjects({
        id,
    }: ButtonScrollerOptions<ButtonScrollerData>): Promise<Data[]> {
        const rawSkills = SkillUtils.getEffects()
        const result: CallbackButtonValue[] = []

        for (const skill of rawSkills) {
            const text = skill.info.title
            const skillId = skill.id

            result.push({
                text,
                data: JSON.stringify({
                    name: skillId,
                    id
                })
            })
        }

        return result
    }

    protected async _editText({
        slicedObjects,
        id
    }: ButtonScrollerFullOptions<Data, ButtonScrollerData>): Promise<ButtonScrollerEditMessageResult> {
        return {
            values: {
                globals: {
                    id: JSON.stringify(id),
                    objId: JSON.stringify({ id }),
                },
                values: {
                    class: slicedObjects
                }
            }
        }
    }

}