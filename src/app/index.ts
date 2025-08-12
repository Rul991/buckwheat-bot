import Bot from '../classes/main/Bot'
import CapsCommand from '../classes/commands/conditional/CapsCommand'
import NoCommand from '../classes/commands/conditional/NoCommand'
import TestCommand from '../classes/commands/buckwheat/TestCommand'
import { CHAT_ID, DB_NAME, DB_URL, TOKEN } from '../utils/consts'
import Validator from '../utils/Validator'
import StartCommand from '../classes/commands/telegram/StartCommand'
import EchoCommand from '../classes/commands/buckwheat/EchoCommand'
import SimpleBuckwheatCommand from '../classes/commands/base/SimpleBuckwheatCommand'
import connectDatabase from './db'
import { join } from 'path'
import ProfileCommand from '../classes/commands/buckwheat/profile/ProfileCommand'
import ChangeNameCommand from '../classes/commands/buckwheat/profile/ChangeNameCommand'
import CasinoDice from '../classes/dice/CasinoDice'
import CreateProfileAction from '../classes/actions/every/CreateProfileAction'
import AddMessagesAction from '../classes/actions/every/AddMessagesAction'
import WrongChatAction from '../classes/actions/every/WrongChatAction'
import CasinoCommand from '../classes/commands/buckwheat/money/CasinoCommand'
import TransferCommand from '../classes/commands/buckwheat/money/TransferCommand'
import ChangeDescriptionCommand from '../classes/commands/buckwheat/profile/ChangeDescriptionCommand'
import StaffCommand from '../classes/commands/buckwheat/top/StaffCommand'
import CreatorCommand from '../classes/commands/buckwheat/admins/CreatorCommand'
import RankCommand from '../classes/commands/buckwheat/admins/RankCommand'
import { readdir } from 'fs/promises'
import MuteCommand from '../classes/commands/buckwheat/admins/MuteCommand'
import PingCommand from '../classes/commands/buckwheat/PingCommand'
import UnmuteCommand from '../classes/commands/buckwheat/admins/UnmuteCommand'
import BanCommand from '../classes/commands/buckwheat/admins/BanCommand'
import UnbanCommand from '../classes/commands/buckwheat/admins/UnbanCommand'
import CubeYesAction from '../classes/callback-button/CubeYesAction'
import CubeCommand from '../classes/commands/buckwheat/money/CubeCommand'
import CubeNoAction from '../classes/callback-button/CubeNoAction'
import UpdateCommand from '../classes/commands/buckwheat/UpdateCommand'
import AntiSpamAction from '../classes/actions/every/AntiSpamAction'
import RuleCommand from '../classes/commands/buckwheat/chat/RuleCommand'
import RuleChangeAction from '../classes/callback-button/RuleChangeAction'
import WorkCommand from '../classes/commands/buckwheat/money/WorkCommand'
import { env } from 'process'
import CommandsCommand from '../classes/commands/CommandsCommand'
import DonateCommand from '../classes/commands/DonateCommand'
import HelloCommand from '../classes/commands/buckwheat/chat/HelloCommand'
import HelloMemberAction from '../classes/actions/new-member/HelloMemberAction'
import MoneyTopCommand from '../classes/commands/buckwheat/top/MoneyTopCommand'
import ImageProfileAction from '../classes/actions/photo/ImageProfileAction'

const isEnvVarsValidate = () => {
    type EnvVariable = {name: string, isMustDefined: boolean}

    const createVariable = (name: string, isMustDefined = true) => 
        ({name, isMustDefined} as EnvVariable)

    const variables = [
        createVariable('BOT_TOKEN'),
        createVariable('DB_NAME'),
        createVariable('DB_URL'),
        createVariable('CHAT_ID'),
        createVariable('EMPTY_PROFILE', false),
        createVariable('DEV_ID', false),
        createVariable('MODE', false),
    ]

    for (const variable of variables) {
        if(!Validator.isEnvVariableDefined(env[variable.name])) {
            const message = `undefined ${variable.name}`

            if(!variable.isMustDefined) {
                console.warn(message)
            }
            else {
                console.error(message)
                return false
            }
        }
    }

    return true
}

const getSimpleCommands = async () => {
    let result: SimpleBuckwheatCommand[] = []
    const resourceSource = './res'
    const parentSource = 'json/simple_commands'

    for await (const src of await readdir(join(resourceSource, parentSource))) {
        result.push(
            await SimpleBuckwheatCommand.loadFromJsonResource(
                join(parentSource, src)
            )
        )
    }

    return result
}

const launchBot = async (bot: Bot) => {
    bot.addEveryMessageActions(
        new WrongChatAction(), // it should be first
        new CreateProfileAction(),
        new AntiSpamAction(), 
        new AddMessagesAction(),
    )

    bot.addPhotoActions(
        new ImageProfileAction()
    )

    bot.addCallbackButtonAction(
        new CubeYesAction(),
        new CubeNoAction(),
        new RuleChangeAction()
    )

    bot.addDiceActions(
        new CasinoDice()
    )

    bot.addNewMemberAction(
        new HelloMemberAction()
    )

    // conditional
    bot.addCommands(
        new CapsCommand(),
        new NoCommand(),
    )
    
    // buckwheat
    bot.addCommands(
        new CommandsCommand(),
        new ProfileCommand(),
        new CasinoCommand(),
        new ChangeNameCommand(),
        new ChangeDescriptionCommand(),
        new StaffCommand(),
        new TestCommand(),
        new EchoCommand(),
        new TransferCommand(),
        new CreatorCommand(),
        new RankCommand(),
        new MuteCommand(),
        new UnmuteCommand(),
        new BanCommand(),
        new UnbanCommand(),
        new PingCommand(),
        new CubeCommand(),
        new UpdateCommand(),
        new RuleCommand(),
        new WorkCommand(),
        new DonateCommand(),
        new HelloCommand(),
        new MoneyTopCommand(),
        ...await getSimpleCommands()
    )

    // tg
    bot.addCommands(
        new StartCommand()
    )

    bot.launch()
}

const main = async () => {
    if(!isEnvVarsValidate()) return
    await connectDatabase()

    const bot = new Bot(TOKEN)
    await launchBot(bot)
}

main()