import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import ExperienceService from '../../../db/services/level/ExperienceService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ExperienceCommand extends BuckwheatCommand {
    private _commandOther = 'осталось до нового уровня'
    private _keyWords = ['уровня']

    constructor() {
        super()
        this._name = 'сколько'
        this._description = `вы говорите "баквит ${this._name} ${this._commandOther}"\nя говорю сколько опыта осталось до нового уровня`
        this._needData = true
        this._argumentText = this._commandOther
    }

    private _equalKeyWords(text?: string): boolean {
        if(!text) return false
        const lowerText = text.toLowerCase()

        for (const word of this._keyWords) {
            if(!lowerText.includes(word)) return false
        }
        
        return true
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx)

        if(!chatId || !this._equalKeyWords(other)) {
            await MessageUtils.sendWrongCommandMessage(ctx)
            return
        }


        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/level/experience.pug',
            {
                changeValues: {
                    exp: ExperienceUtils.getNeedExperienceToLevelUp(
                        await ExperienceService.get(chatId, ctx.from.id)
                    )
                }
            }
        )
    }
}