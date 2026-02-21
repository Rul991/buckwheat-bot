import MessageUtils from '../../../utils/MessageUtils'
import RandomUtils from '../../../utils/RandomUtils'
import { REACTIONS } from '../../../utils/values/consts'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import EveryMessageAction from './EveryMessageAction'

export default class extends EveryMessageAction {
    constructor() {
        super()
    }

    async execute({ ctx, chatId }: EveryMessageOptions): Promise<void | true> {
        if(!chatId) return
        const reactionChance = await ChatSettingsService.get<'number'>(
            chatId, 
            'reactChance'
        )

        if(RandomUtils.chance(reactionChance / 100)) {
            const reaction = RandomUtils.choose(REACTIONS)!
            await MessageUtils.react(ctx, reaction)
        }
    }
}