import { FullSubCommandObject } from '../../../utils/values/types/types'
import BuckwheatCommand from './BuckwheatCommand'
import SubCommandUtils from '../../../utils/SubCommandUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import { ActionAccess } from '../../../utils/values/types/command-access'
import CommandAccessService from '../../db/services/settings/access/CommandAccessService'

export default abstract class BuckwheatCommandWithSub<Sub extends FullSubCommandObject> extends BuckwheatCommand {
    protected _subCommands: Sub[]

    constructor (subCommands: Sub[]) {
        super()
        this._subCommands = subCommands
        this._needData = true
        this._argumentText = SubCommandUtils.getArgumentText(this._subCommands)
    }

    get subActionAccessses(): ActionAccess[] {
        return this._subCommands.map(({ settingId, name, minimumRank }) => {
            return {
                setting: {
                    title: `Баквит ${this._name} ${name}`,
                    description: `Определяет ранг команды ''баквит ${this._name} ${name}'' типа ${this.typeName}`,
                    type: 'enum' as 'enum',
                    default: minimumRank ?? this._minimumRank,
                    properties: {
                        values: [0, 1, 2, 3, 4, 5]
                    }
                },
                name: settingId
            }
        })
    }

    get actionAccesses(): ActionAccess[] {
        return [
            ...super.actionAccesses,
            ...this.subActionAccessses
        ]
    }

    protected async _execute(options: BuckwheatCommandOptions, subCommand: [Sub, string]): Promise<void> {
        const [sub, data] = subCommand

        if (!await this._checkAccess(options, subCommand)) {
            return
        }

        const isRightData = await sub.execute({
            ...options,
            data
        })

        if (isRightData) {
            await this._handleCommand(options, subCommand)
        }
        else {
            await this._handleWrongDataCommand(options, sub)
        }
    }

    protected async _checkAccess(options: BuckwheatCommandOptions, subCommand: [Sub, string]): Promise<boolean> {
        return true
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const { other, ctx, chatId, id } = options
        const subCommand = SubCommandUtils.getSubCommandAndData(
            other,
            this._subCommands
        )

        if (subCommand == 'no-text') {
            await this._handleNoText(options)
        }
        else if (subCommand == 'not-exist') {
            await this._handleNotExistCommand(options)
        }
        else {
            const [sub] = subCommand
            const canUse = await CommandAccessService.canUse({
                ctx,
                chatId,
                id,
                command: {
                    command: `${this._name} ${sub.name}`
                },
                settingId: sub.settingId
            })
            if(!canUse) return
            await this._execute(options, subCommand)
        }
    }

    protected abstract _handleNoText(options: BuckwheatCommandOptions): Promise<void>
    protected abstract _handleNotExistCommand(options: BuckwheatCommandOptions): Promise<void>
    protected abstract _handleWrongDataCommand(options: BuckwheatCommandOptions, sub: Sub): Promise<void>
    protected abstract _handleCommand(options: BuckwheatCommandOptions, [sub, data]: [Sub, string]): Promise<void>
}