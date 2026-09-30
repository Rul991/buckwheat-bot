import type BuckwheatCommand from "../../base/BuckwheatCommand"
import TelegramCommand from "../../base/TelegramCommand"

export default class HelpTelegramCommand extends TelegramCommand {
    protected override _command?: BuckwheatCommand | undefined
    override settingId: number = 102

    constructor() {
        super('help')
    }
}