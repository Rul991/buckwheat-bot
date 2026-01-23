import SkillUtils from '../../../utils/SkillUtils'
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
        chatId,
        id
    }: ButtonScrollerOptions<ButtonScrollerData>): Promise<Data[]> {
        const result: CallbackButtonValue[] = []

        const type = await UserClassService.get(chatId, id)
        const rawSkills = await SkillUtils.getSkillsFromFile(type)
        const skills = rawSkills
            .filter(skill => skill.isEffect)

        const buttons: CallbackButtonValue[] = skills.map(skill => ({
            text: `${skill.title}`,
            data: JSON.stringify({
                name: skill.id,
                type
            })
        }))

        result.push(...buttons)

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