import RandomUtils from '../../utils/RandomUtils'
import { DICE_ANSWER_CHANCE } from '../../utils/values/consts'
import { DiceOptions } from '../../utils/values/types/action-options'
import { DiceContext } from '../../utils/values/types/contexts'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../db/services/settings/ChatSettingsService'
import BaseDice from './BaseDice'

export default class DiceDice extends BaseDice {
    constructor() {
        super()
        this._name = '🎲'
    }

    async execute({ ctx }: DiceOptions): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const answerChance = (await ChatSettingsService.get<'number'>(
            chatId, 
            'diceAnswerChance'
        ) ?? DICE_ANSWER_CHANCE) / 100

        if(!RandomUtils.chance(answerChance)) return
        
        await ctx.replyWithDice({
            emoji: this._name
        })
    }
}