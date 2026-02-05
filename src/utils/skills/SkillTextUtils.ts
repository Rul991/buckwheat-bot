import SkillAttack from '../../enums/SkillAttack'
import FileUtils from '../FileUtils'
import { GetTextSkillOptions } from '../values/types/skills'
import SkillUtils from './SkillUtils'

type MessageOptions = Omit<GetTextSkillOptions, 'attack' | 'enemyId' | 'bold'> & {
    attack?: SkillAttack
    enemyId?: number
}

export default class {
    private static async _message(filename: string, options: MessageOptions, bold: boolean) {
        const {
            skill
        } = options

        const attack = options.attack ?? SkillAttack.Normal
        const enemyId = options.enemyId ?? options.userId

        const effectsText = await SkillUtils.getTextsSkill({
            ...options,
            attack,
            enemyId,
            bold
        })

        return await FileUtils.readPugFromResource(
            filename,
            {
                changeValues: {
                    ...skill,
                    effectsText
                }
            }
        )
    }

    static async message(options: MessageOptions) {
        return await this._message(
            'text/commands/skills/view.pug',
            options,
            true
        )
    }

    static async alert(options: MessageOptions) {
        return await this._message(
            'text/actions/skill/view.pug',
            options,
            false
        )
    }
}