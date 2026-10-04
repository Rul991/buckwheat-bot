import type BuckwheatCommand from "../../base/BuckwheatCommand"
import TelegramCommand from "../../base/TelegramCommand"
import FaqCommand from "../buckwheat/info/FaqCommand"

export default class HelpTelegramCommand extends TelegramCommand {
    protected override _command?: BuckwheatCommand | undefined = new FaqCommand
    override settingId: number = 102

    constructor() {
        super('help')
    }
}