import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import BuckwheatCommand from '../../../commands/base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/other/no-premium.pug'
        )
    }
}