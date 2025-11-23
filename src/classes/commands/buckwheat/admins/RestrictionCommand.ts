import RankUtils from '../../../../utils/RankUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default abstract class extends BuckwheatCommand {
    constructor() {
        super()

        this._minimumRank = RankUtils.moderator
        this._needData = true
        this._replySupport = true
        this._argumentText = '(снять | дать) [причина]'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        
    }
}