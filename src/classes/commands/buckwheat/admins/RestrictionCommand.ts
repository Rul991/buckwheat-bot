import RankUtils from '../../../../utils/RankUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default abstract class extends BuckwheatCommand {
    constructor() {
        super()

        this._minimumRank = RankUtils.moderator
        this._needData = true
        this._replySupport = true
        this._argumentText = '(снять | дать) [причина]'
    }

    async execute({ ctx, other }: BuckwheatCommandOptions): Promise<void> {
        
    }
}