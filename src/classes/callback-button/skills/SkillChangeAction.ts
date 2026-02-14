import { ButtonScrollerEditMessageResult, ButtonScrollerFullOptions, ButtonScrollerOptions, TinyCurrentIncreaseId } from '../../../utils/values/types/types'
import UserClassService from '../../db/services/user/UserClassService'
import FileUtils from '../../../utils/FileUtils'
import Skill from '../../../interfaces/duel/Skill'
import ClassUtils from '../../../utils/ClassUtils'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'
import SkillService from '../../db/services/chosen-skills/SkillService'

export default class extends ButtonScrollerAction<Skill, TinyCurrentIncreaseId> {
    protected _filename: string = 'skills/add'
    protected _buttonTitle: string = 'Навык: Пролистывание'

    constructor () {
        super()
        this._name = 'skillchange'
    }

    protected async _getObjects({
        chatId,
        id
    }: ButtonScrollerOptions<TinyCurrentIncreaseId>): Promise<Skill[]> {
        const currentSkills = await SkillService.get(chatId, id)
        const availableSkills = (await SkillService.getAvailableSkills(chatId, id))
            .filter(skill => currentSkills.every(s => skill.id != s))

        return availableSkills
    }

    protected async _editText({
        chatId,
        id,
        slicedObjects,
        data
    }: ButtonScrollerFullOptions<Skill, TinyCurrentIncreaseId>): Promise<ButtonScrollerEditMessageResult> {
        const type = await UserClassService.get(chatId, id)
        const {
            c: current,
            i: increase
        } = data

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/skills/choose.pug',
                {
                    changeValues: {
                        emoji: ClassUtils.getEmoji(type)
                    }
                }
            ),
            values: {
                globals: {
                    id: JSON.stringify({ id })
                },
                values: {
                    add: slicedObjects.map(v =>
                        ({
                            text: v.info.title,
                            data: JSON.stringify({ id, index: v.id, type: 'a', p: current + increase })
                        })
                    )
                }
            }
        }
    }
}