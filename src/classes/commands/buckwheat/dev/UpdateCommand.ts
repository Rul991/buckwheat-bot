import BuckwheatCommand from '../../base/BuckwheatCommand'
import { DEV_ID } from '../../../../utils/values/consts'
import { exec } from 'node:child_process'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class UpdateCommand extends BuckwheatCommand {
    protected _settingId: string = 'ava'
    protected _canBeChanged: boolean = false

    constructor() {
        super()
        this._name = 'обновись'
        this._isShow = false
    }

    async execute({ ctx, id }: BuckwheatCommandOptions): Promise<void> {
        if(id == +DEV_ID!) {
            exec('git pull && bun run restart:prod', async (_, stdout) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/update/stdout.pug',
                    {changeValues: {stdout}}
                )
            })
        }
        else {
            await MessageUtils.sendWrongCommandMessage(ctx)
        }
    }
}