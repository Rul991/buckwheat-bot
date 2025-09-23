import Bot from '../classes/main/Bot'
import CapsCommand from '../classes/commands/conditional/CapsCommand'
import NoCommand from '../classes/commands/conditional/NoCommand'
import TestCommand from '../classes/commands/buckwheat/dev/TestCommand'
import { DOMAIN, MODE, TOKEN } from '../utils/values/consts'
import Validator from '../utils/Validator'
import StartCommand from '../classes/commands/telegram/StartCommand'
import EchoCommand from '../classes/commands/buckwheat/game/EchoCommand'
import SimpleBuckwheatCommand from '../classes/commands/base/SimpleBuckwheatCommand'
import { connectDatabase } from './db'
import { join } from 'path'
import ProfileCommand from '../classes/commands/buckwheat/profile/ProfileCommand'
import ChangeNameCommand from '../classes/commands/buckwheat/profile/ChangeNameCommand'
import CasinoDice from '../classes/dice/CasinoDice'
import WrongChatAction from '../classes/actions/every/WrongChatAction'
import BalanceCommand from '../classes/commands/buckwheat/money/BalanceCommand'
import TransferCommand from '../classes/commands/buckwheat/money/TransferCommand'
import ChangeDescriptionCommand from '../classes/commands/buckwheat/profile/ChangeDescriptionCommand'
import CreatorCommand from '../classes/commands/buckwheat/admins/CreatorCommand'
import RankCommand from '../classes/commands/buckwheat/admins/RankCommand'
import { readdir } from 'fs/promises'
import MuteCommand from '../classes/commands/buckwheat/admins/MuteCommand'
import PingCommand from '../classes/commands/buckwheat/other/PingCommand'
import UnmuteCommand from '../classes/commands/buckwheat/admins/UnmuteCommand'
import BanCommand from '../classes/commands/buckwheat/admins/BanCommand'
import UnbanCommand from '../classes/commands/buckwheat/admins/UnbanCommand'
import CubeYesAction from '../classes/callback-button/cube/CubeYesAction'
import CubeCommand from '../classes/commands/buckwheat/money/CubeCommand'
import CubeNoAction from '../classes/callback-button/cube/CubeNoAction'
import UpdateCommand from '../classes/commands/buckwheat/dev/UpdateCommand'
import AntiSpamAction from '../classes/actions/every/AntiSpamAction'
import RuleCommand from '../classes/commands/buckwheat/chat/RuleCommand'
import RuleChangeAction from '../classes/callback-button/scrollers/RuleChangeAction'
import WorkCommand from '../classes/commands/buckwheat/money/WorkCommand'
import { env } from 'process'
import CommandsCommand from '../classes/commands/buckwheat/info/CommandsCommand'
import DonateCommand from '../classes/commands/buckwheat/dev/DonateCommand'
import HelloCommand from '../classes/commands/buckwheat/chat/HelloCommand'
import HelloMemberAction from '../classes/actions/new-member/HelloMemberAction'
import TopCommand from '../classes/commands/buckwheat/top/TopCommand'
import ImageProfileAction from '../classes/actions/photo/ImageProfileAction'
import ShopCommand from '../classes/commands/buckwheat/money/ShopCommand'
import ItemChangeAction from '../classes/callback-button/shop/ItemChangeAction'
import BuyAction from '../classes/callback-button/shop/BuyAction'
import InventoryCommand from '../classes/commands/buckwheat/info/InventoryCommand'
import VerificationAction from '../classes/callback-button/VerificationAction'
import RandomPrizeMessageAction from '../classes/actions/every/RandomPrizeMessageAction'
import RandomPrizeButtonAction from '../classes/callback-button/RandomPrizeButtonAction'
import NewMessagesAction from '../classes/actions/every/NewMessagesAction'
import ClassAction from '../classes/callback-button/ClassAction'
import ClassCommand from '../classes/commands/buckwheat/profile/ClassCommand'
import GreedBoxCommand from '../classes/commands/buckwheat/money/GreedBoxCommand'
import CookieCommand from '../classes/commands/buckwheat/game/CookieCommand'
import IdeaCommand from '../classes/commands/buckwheat/info/IdeaCommand'
import IdeaChangeAction from '../classes/callback-button/ideas/IdeaChangeAction'
import DeleteIdeaAction from '../classes/callback-button/ideas/DeleteIdeaAction'
import VoteAction from '../classes/callback-button/ideas/VoteAction'
import SaveCommand from '../classes/commands/buckwheat/game/SaveCommand'
import InfoCommand from '../classes/commands/buckwheat/game/InfoCommand'
import MoneyDropCommand from '../classes/commands/buckwheat/game/MoneyDropCommand'
import RoleplayCommand from '../classes/commands/buckwheat/game/RoleplayCommand'
import CustomRoleplayCommand from '../classes/commands/conditional/CustomRoleplayCommand'
import ExperienceCommand from '../classes/commands/buckwheat/level/ExperienceCommand'
import AddInDatabaseAction from '../classes/actions/new-member/AddInDatabaseAction'
import LinkCommand from '../classes/commands/buckwheat/profile/LinkCommand'
import InventoryItemsUtils from '../utils/InventoryItemsUtils'
import AddLeftInDatabaseAction from '../classes/actions/left-member/AddLeftInDatabaseAction'
import RandomCommand from '../classes/commands/buckwheat/other/RandomCommand'
import CommandsChangeAction from '../classes/callback-button/scrollers/CommandsChangeAction'
import DiceDice from '../classes/dice/DiceDice'
import StatsCommand from '../classes/commands/buckwheat/info/StatsCommand'
import DebtMemberAction from '../classes/actions/new-member/DebtMemberAction'
import ChannelCommand from '../classes/commands/buckwheat/info/ChannelCommand'
import LevelCommand from '../classes/commands/buckwheat/level/LevelCommand'
import RouletteCommand from '../classes/commands/buckwheat/game/RouletteCommand'
import RoleplayChangeAction from '../classes/callback-button/scrollers/RoleplayChangeAction'
import MarriageCommand from '../classes/commands/buckwheat/marriage/MarriageCommand'
import MarryCommand from '../classes/commands/buckwheat/marriage/MarryCommand'
import MarryYesAction from '../classes/callback-button/marry/MarryYesAction'
import DivorceCommand from '../classes/commands/buckwheat/marriage/DivorceCommand'
import MarryNoAction from '../classes/callback-button/marry/MarryNoAction'
import WipeCommand from '../classes/commands/buckwheat/admins/WipeCommand'
import ChooseCommand from '../classes/commands/buckwheat/game/ChooseCommand'
import AddAwardCommand from '../classes/commands/award/AddAwardCommand'
import CubeWinsService from '../classes/db/services/cube/CubeWinsService'
import GetAwardCommand from '../classes/commands/award/GetAwardCommand'
import AwardsChangeAction from '../classes/callback-button/scrollers/AwardsChangeAction'

const isEnvVarsValidate = () => {
    type EnvVariable = { name: string, isMustDefined: boolean }

    const createVariable = (name: string, isMustDefined = true) =>
        ({ name, isMustDefined } as EnvVariable)

    const variables = [
        createVariable('BOT_TOKEN'),
        createVariable('DB_NAME'),
        createVariable('DB_URL'),
        createVariable('CHAT_ID'),
        createVariable('DEV_ID', false),
        createVariable('MODE', false),
        createVariable('DOMAIN', false),
        createVariable('HOOK_PORT', false),
        createVariable('SECRET_TOKEN', false),
        createVariable('SECRET_PATH', false),
    ]

    for (const variable of variables) {
        if (!Validator.isEnvVariableDefined(env[variable.name])) {
            const message = `undefined ${variable.name}`

            if (!variable.isMustDefined) {
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

const getCommands = async <
    T extends typeof SimpleBuckwheatCommand
>(folderPath: string, CommandClass: T): Promise<InstanceType<T>[]> => {
    let result: InstanceType<T>[] = []
    const resourceSource = './res'
    const parentSource = `json/${folderPath}`

    for await (const src of await readdir(join(resourceSource, parentSource))) {
        result.push(
            await CommandClass.loadFromJsonResource(
                join(parentSource, src)
            ) as InstanceType<T>
        )
    }

    return result
}

const getSimpleCommands = async () => {
    return await getCommands('simple_commands', SimpleBuckwheatCommand)
}

const launchBot = async (bot: Bot) => {
    bot.addEveryMessageActions(
        new WrongChatAction(), // it should be first
        new AntiSpamAction(),
        new NewMessagesAction(),
        new RandomPrizeMessageAction(),
    )

    bot.addLeftMemberActions(
        new AddLeftInDatabaseAction()
    )

    bot.addPhotoActions(
        new ImageProfileAction()
    )

    bot.addCallbackButtonAction(
        new CubeYesAction(),
        new CubeNoAction(),
        new RuleChangeAction(),
        new ItemChangeAction(),
        new BuyAction(),
        new VerificationAction(),
        new RandomPrizeButtonAction(),
        new ClassAction(),
        new IdeaChangeAction(),
        new VoteAction(),
        new DeleteIdeaAction(),
        new CommandsChangeAction(),
        new RoleplayChangeAction(),
        new AwardsChangeAction(),
        new MarryYesAction(),
        new MarryNoAction()
    )

    bot.addDiceActions(
        new CasinoDice(),
        new DiceDice()
    )

    bot.addNewMemberAction(
        new AddInDatabaseAction(),
        new HelloMemberAction(),
        new DebtMemberAction(),
    )

    // conditional
    bot.addCommands(
        new CapsCommand(),
        new NoCommand(),
        new CustomRoleplayCommand()
    )

    // buckwheat
    bot.addCommands(
        new CommandsCommand(),
        new ProfileCommand(),
        new BalanceCommand(),
        new ChangeNameCommand(),
        new ChangeDescriptionCommand(),
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
        new TopCommand(),
        new ShopCommand(),
        new InventoryCommand(),
        new ClassCommand(),
        new GreedBoxCommand(),
        new CookieCommand(),
        new IdeaCommand(),
        new SaveCommand(),
        new InfoCommand(),
        new MoneyDropCommand(),
        new RoleplayCommand(),
        new ExperienceCommand(),
        new LevelCommand(),
        new LinkCommand(),
        new RandomCommand(),
        new StatsCommand(),
        new ChannelCommand(),
        new RouletteCommand(),
        new MarriageCommand(),
        new MarryCommand(),
        new DivorceCommand(),
        new WipeCommand(),
        new AddAwardCommand(),
        new GetAwardCommand(),
        new ChooseCommand(),
        ...await getSimpleCommands(),
    )

    // tg
    bot.addCommands(
        new StartCommand()
    )

    console.log('Start launching!')
    await bot.launch(Boolean(DOMAIN))
}

const test = async (): Promise<void | boolean> => {

}

const main = async () => {
    if (MODE == 'dev') {
        if (await test()) return
    }

    if (!isEnvVarsValidate()) return
    await connectDatabase()
    
    if(!await InventoryItemsUtils.setup()) return

    const bot = new Bot(TOKEN)
    await launchBot(bot)
}

main()