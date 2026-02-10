import CharacterUtils from '../../../utils/duel/CharacterUtils'
import { SKIP_SKILL_SKILL_NAME } from '../../../utils/values/consts'
import { GenericSpecialEffectOptions } from '../../../utils/values/types/duels'
import EffectService from '../../db/services/duel/EffectService'
import UserClassService from '../../db/services/user/UserClassService'
import SpecialEffect from './SpecialEffect'

type Options = {

}

export default class extends SpecialEffect<Options> {
    protected _name: string = SKIP_SKILL_SKILL_NAME

    protected async _get(options: GenericSpecialEffectOptions<Options>): Promise<number> {
        const {
            chatId,
            id,
            duel,
            skill
        } = options

        const classType = await UserClassService.get(chatId, id)
        const character = CharacterUtils.get(classType)

        const mainSkillId = character.skill.main
        const skillId = skill.id
        const duelId = duel.id

        if(mainSkillId == skillId) {
            return 0
        }
        else {
            const hasEffect = await EffectService.userHas(
                duelId,
                id,
                this._name
            )

            return +hasEffect
        }
    }
}