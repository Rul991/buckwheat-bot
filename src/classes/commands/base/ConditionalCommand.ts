import BaseAction from '../../actions/base/BaseAction'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'

export default abstract class ConditionalCommand extends BaseAction {
    protected abstract _condition(options: ConditionalCommandOptions): Promise<boolean>
    protected abstract _execute(options: ConditionalCommandOptions): Promise<boolean | void>

    async execute(options: ConditionalCommandOptions): Promise<boolean> {
        const needExecute = await this._condition(options)

        if(needExecute) {
            return await this._execute(options) ?? true
        }

        return needExecute
    }
}