import { ButtonScrollerEditMessageResult, ButtonScrollerFullOptions, ButtonScrollerOptions, TinyCurrentIncreaseId } from '../../../utils/values/types/types'
import UserClassService from '../../db/services/user/UserClassService'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import FileUtils from '../../../utils/FileUtils'
import Skill from '../../../interfaces/duel/Skill'
import ClassUtils from '../../../utils/ClassUtils'
import SkillUtils from '../../../utils/SkillUtils'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

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
        const type = await UserClassService.get(chatId, id)
        const currentSkills = await ChosenSkillsService.getSkills(chatId, id)
        const availableSkills = (await SkillUtils.getAvailableSkills(chatId, id, type))
            .filter(skill => currentSkills.every(s => skill.id != s))

        return availableSkills
    }

    protected async _editText({
        chatId,
        id,
        slicedObjects
    }: ButtonScrollerFullOptions<Skill, TinyCurrentIncreaseId>): Promise<ButtonScrollerEditMessageResult> {
        const type = await UserClassService.get(chatId, id)

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
                            text: v.title,
                            data: JSON.stringify({ id, index: v.id, type: 'a' })
                        })
                    )
                }
            }
        }
    }
}