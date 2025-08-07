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
import path, { join } from 'path'
import ProfileCommand from '../classes/commands/buckwheat/profile/ProfileCommand'
import ChangeNameCommand from '../classes/commands/buckwheat/profile/ChangeNameCommand'
import CasinoDice from '../classes/dice/CasinoDice'
import CreateProfileAction from '../classes/actions/every/CreateProfileAction'
import AddMessagesAction from '../classes/actions/every/AddMessagesAction'
import WrongChatAction from '../classes/actions/every/WrongChatAction'
import CasinoCommand from '../classes/commands/buckwheat/CasinoCommand'
import TransferCommand from '../classes/commands/buckwheat/TransferCommand'
import ChangeDescriptionCommand from '../classes/commands/buckwheat/profile/ChangeDescriptionCommand'
import StaffCommand from '../classes/commands/buckwheat/StaffCommand'
import CreatorCommand from '../classes/commands/buckwheat/admins/CreatorCommand'
import RankCommand from '../classes/commands/buckwheat/admins/RankCommand'
import { readdir } from 'fs/promises'
import MuteCommand from '../classes/commands/buckwheat/admins/MuteCommand'
import HelloCommand from '../classes/commands/buckwheat/HelloCommand'
import DemuteCommand from '../classes/commands/buckwheat/admins/DemuteCommand'
import KickCommand from '../classes/commands/buckwheat/admins/KickCommand'
import UnbanCommand from '../classes/commands/buckwheat/admins/UnbanCommand'
import CheatCommand from '../classes/commands/buckwheat/admins/CheatCommand'

const isEnvVarsValidate = () => {
    if(!Validator.isEnvValueDefined(TOKEN)) {
        console.error('undefined token')
        return false
    }

    if(!Validator.isEnvValueDefined(DB_NAME)) {
        console.error('undefined db name')
        return false
    }

    if(!Validator.isEnvValueDefined(DB_URL)) {
        console.error('undefined db url')
        return false
    }

    if(!Validator.isEnvValueDefined(CHAT_ID)) {
        console.error('undefined chat id')
        return false
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
        new AddMessagesAction(),
        new CreateProfileAction(),
    )

    bot.addDiceActions(
        new CasinoDice()
    )

    // conditional
    bot.addCommands(
        new CapsCommand(),
        new NoCommand(),
    )
    
    // buckwheat
    bot.addCommands(
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
        new DemuteCommand(),
        new KickCommand(),
        new UnbanCommand(),
        new HelloCommand(),
        new CheatCommand(),
        ...await getSimpleCommands()
    )

    // tg
    bot.addCommands(
        new StartCommand()
    )

    bot.launch()
}

const stopBot = (bot: Bot): NodeJS.SignalsListener => {
    return signal => {
        bot.stop(signal)
        console.log(`bot is stopped [${signal}]`)
        process.exit(0)
    }
}

const main = async () => {
    if(!isEnvVarsValidate()) return
    
    await connectDatabase()

    const bot = new Bot(TOKEN)
    await launchBot(bot)

    const stopListener = stopBot(bot)
    process.once('SIGINT', stopListener)
    process.once('SIGTERM', stopListener)
}

main()