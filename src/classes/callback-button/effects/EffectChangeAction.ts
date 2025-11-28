import { JSONSchemaType } from 'ajv'
import ClassUtils from '../../../utils/ClassUtils'
import SkillUtils from '../../../utils/SkillUtils'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, CallbackButtonValue, CurrentIncreaseId } from '../../../utils/values/types/types'
import UserClassService from '../../db/services/user/UserClassService'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

type Data = CallbackButtonValue
type ButtonScrollerData = {
    c: number,
    i: number,
    id?: number
}

export default class extends ButtonScrollerAction<Data, ButtonScrollerData> {
    protected _filename: string = 'effects/classes'
    protected _schema: JSONSchemaType<ButtonScrollerData> = {
        type: 'object',
        required: ['c', 'i'],
        properties: {
            c: {
                type: 'number'
            },
            i: {
                type: 'number'
            },
            id: {
                type: 'number',
                nullable: true
            }
        }
    }

    constructor () {
        super()
        this._name = 'echg'
    }

    protected _getCurrentIncreaseIdNames(): CurrentIncreaseId<ButtonScrollerData> {
        return {
            current: 'c',
            increase: 'i',
            id: 'id'
        }
    }

    protected async _getObjects({
        chatId,
        id
    }: ButtonScrollerOptions<ButtonScrollerData>): Promise<Data[]> {
        const result: CallbackButtonValue[] = []

        const type = await UserClassService.get(chatId, id)
        const skills = (await SkillUtils.getSkillsFromFile(type))
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