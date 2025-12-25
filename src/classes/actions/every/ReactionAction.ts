import MessageUtils from '../../../utils/MessageUtils'
import RandomUtils from '../../../utils/RandomUtils'
import { REACTION_CHANCE, REACTIONS } from '../../../utils/values/consts'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'
import { MessageContext } from '../../../utils/values/types/contexts'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import EveryMessageAction from './EveryMessageAction'

export default class extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute({ ctx, chatId, id }: EveryMessageOptions): Promise<void | true> {
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