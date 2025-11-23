import MessageUtils from '../../../utils/MessageUtils'
import RandomUtils from '../../../utils/RandomUtils'
import { REACTION_CHANCE, REACTIONS } from '../../../utils/values/consts'
import { MessageContext } from '../../../utils/values/types'
import EveryMessageAction from './EveryMessageAction'

export default class extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute(ctx: MessageContext): Promise<void | true> {
        if(RandomUtils.chance(REACTION_CHANCE)) {
            const reaction = RandomUtils.choose(REACTIONS)!
            await MessageUtils.react(ctx, reaction)
        }
    }
}