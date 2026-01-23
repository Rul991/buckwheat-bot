import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { ActionAccess } from '../../../../utils/values/types/command-access'
import BuckwheatCommand from '../../../commands/base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = ''
    get actionAccesses(): ActionAccess[] {
        return []
    }
    
    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/other/no-premium.pug'
        )
    }
}