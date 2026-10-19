import { exec } from "node:child_process"
import { BuckwheatCommandOptions } from "../../../../utils/values/types/action-options"
import BuckwheatCommand from "../../base/BuckwheatCommand"
import { ActionAccess } from "../../../../utils/values/types/command-access"
import WrongCommand from "../../../actions/service/text/WrongCommand"
import { DEV_ID } from "../../../../utils/values/consts"
import MessageUtils from "../../../../utils/MessageUtils"

export default class ShCommand extends BuckwheatCommand {
    private _wrongCommand: BuckwheatCommand = new WrongCommand()

    protected _settingId: string = ''
    get actionAccesses(): ActionAccess[] {
        return []
    }

    constructor() {
        super()
        this._name = 'sh'
        this._isShow = false
        this._canBeChanged = false
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            id,
            other = 'echo Hello World!'
        } = options

        if (id != DEV_ID) {
            await this._wrongCommand.execute(options)
            return
        }

        exec(
            other,
            async (_, stdout) => {
                await MessageUtils.answer(
                    ctx,
                    stdout
                )
            }
        )
    }
}