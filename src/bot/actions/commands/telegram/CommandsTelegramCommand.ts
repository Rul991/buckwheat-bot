import type BuckwheatCommand from "../../base/BuckwheatCommand"
import TelegramCommand from "../../base/TelegramCommand"
import CommandsCommand from "../buckwheat/info/CommandsCommand"

export default class CommandsTelegramCommand extends TelegramCommand {
    protected override _command?: BuckwheatCommand | undefined = new CommandsCommand()
    override settingId: number = 97

    constructor() {
        super('commands')
    }
}