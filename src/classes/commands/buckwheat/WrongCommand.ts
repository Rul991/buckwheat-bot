import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'

export default class WrongCommand extends BuckwheatCommand {
    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.sendWrongCommandMessage(ctx)
    }
}