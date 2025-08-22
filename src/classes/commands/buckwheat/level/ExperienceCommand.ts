import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import ExperienceService from '../../../db/services/level/ExperienceService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ExperienceCommand extends BuckwheatCommand {
    private _commandOther = 'осталось до нового уровня'

    constructor() {
        super()
        this._name = 'сколько'
        this._description = `вы говорите "баквит ${this._name} ${this._commandOther}"\nя говорю сколько опыта осталось до нового уровня`
        this._needData = true
        this._argumentText = this._commandOther
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(other?.toLowerCase() !== this._commandOther) {
            await MessageUtils.sendWrongCommandMessage(ctx)
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/level/experience.pug',
            {
                changeValues: {
                    exp: ExperienceUtils.getNeedExperienceToLevelUp(
                        await ExperienceService.get(ctx.from.id)
                    )
                }
            }
        )
    }
}