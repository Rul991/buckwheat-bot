import { CallbackButtonContext } from '../../utils/types'
import CallbackButtonAction from './CallbackButtonAction'

export default class RuleChangeAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'rulechange'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        
    }
}