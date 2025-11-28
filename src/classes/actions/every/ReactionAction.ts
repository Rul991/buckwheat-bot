import MessageUtils from '../../../utils/MessageUtils'
import RandomUtils from '../../../utils/RandomUtils'
import { REACTION_CHANCE, REACTIONS } from '../../../utils/values/consts'
import { MessageContext } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import EveryMessageAction from './EveryMessageAction'

export default class extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute(ctx: MessageContext): Promise<void | true> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const reactionChance = await ChatSettingsService.get<'number'>(
            chatId, 
            'reactChance'
        ) ?? REACTION_CHANCE

        if(RandomUtils.chance(reactionChance / 100)) {
            const reaction = RandomUtils.choose(REACTIONS)!
            await MessageUtils.react(ctx, reaction)
        }
    }
}