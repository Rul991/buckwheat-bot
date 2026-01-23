import AdminUtils from '../../../../utils/AdminUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import PinCommand from './PinCommand'

export default class UnpinCommand extends PinCommand {
    protected _isUndoCommand: boolean = true
    protected _settingId: string = 'unpin'

    constructor () {
        super()

        this._name = 'откреп'
        this._aliases = [
            'анпин',
            'открепить'
        ]
        this._description = 'открепляю сообщение'
    }

    protected _do({ ctx }: BuckwheatCommandOptions) {
        return AdminUtils.unpin(ctx)
    }
}