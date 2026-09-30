import type BuckwheatCommand from "../../base/BuckwheatCommand"
import TelegramCommand from "../../base/TelegramCommand"
import SettingCommand from "../buckwheat/settings/SettingCommand"

export default class SettingsTelegramCommand extends TelegramCommand {
    protected override _command?: BuckwheatCommand | undefined = new SettingCommand()
    override settingId: number = 96

    constructor() {
        super('settings')
    }
}